'use strict';

var _ClickCounter = _interopRequireDefault(require("../components/ClickCounter"));

var _fs = _interopRequireDefault(require("fs"));

var _mockFs2 = _interopRequireDefault(require("mock-fs"));

var _module = _interopRequireDefault(require("module"));

var _path = _interopRequireDefault(require("path"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactTestRenderer = _interopRequireDefault(require("react-test-renderer"));

var _sinon = _interopRequireDefault(require("sinon"));

var _snapshotLoader = require("../../helpers/snapshotLoader");

var _unexpected = _interopRequireDefault(require("unexpected"));

var _unexpectedSinon = _interopRequireDefault(require("unexpected-sinon"));

var _mockJasmine = _interopRequireDefault(require("../helpers/mock-jasmine"));

var _jestMatchers = _interopRequireDefault(require("jest-matchers"));

var _testRendererJest = _interopRequireDefault(require("../../test-renderer-jest"));

var _functions = _interopRequireDefault(require("../fixtures/functions"));

var _snapshots = require("../../helpers/snapshots");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function loadSnapshotMock(snapshotPath) {
  var snapModule = new _module["default"](snapshotPath, null);
  snapModule.load(snapshotPath);
  return snapModule.exports;
}

(0, _snapshotLoader.injectLoader)(loadSnapshotMock);

var expect = _unexpected["default"].clone().use(_testRendererJest["default"]).use(_unexpectedSinon["default"]);

expect.output.preferredWidth = 80;

_bluebird["default"].promisifyAll(_fs["default"]);

var fixtures = {};
describe('snapshots', function () {
  var PATH_TO_TESTS = '/path/to/tests';
  var state, removeUncheckedKeysStub;
  before(function (done) {
    _fs["default"].readdirAsync(_path["default"].join(__dirname, '../fixtures')).then(function (dirList) {
      return _bluebird["default"].all(dirList.map(function (entry) {
        return _fs["default"].readFileAsync(_path["default"].join(__dirname, '../fixtures', entry)).then(function (data) {
          fixtures[_path["default"].basename(entry, '.snapshot')] = data.toString('utf-8');
        });
      }));
    }).then(function () {
      return done();
    })["catch"](function (e) {
      return done(e);
    });
  });
  beforeEach(function () {
    removeUncheckedKeysStub = _sinon["default"].stub();
    state = {
      testPath: '/tmp/changeme.js',
      currentTestName: 'foo',
      snapshotState: {
        added: 0,
        updated: 0,
        unmatched: 0,
        update: undefined,
        removeUncheckedKeys: removeUncheckedKeysStub
      }
    };

    _jestMatchers["default"].setState(state);

    _sinon["default"].spy(_fs["default"], 'writeFileSync');

    (0, _snapshots.injectStateHooks)();
  });
  afterEach(function () {
    _fs["default"].writeFileSync.restore();
  });
  beforeEach(function () {
    var _mockFs;

    (0, _mockFs2["default"])((_mockFs = {}, _defineProperty(_mockFs, PATH_TO_TESTS + '/__snapshots__/single.spec.unexpected-snap', fixtures.single), _defineProperty(_mockFs, PATH_TO_TESTS + '/__snapshots__/multiple.spec.unexpected-snap', fixtures.multiple), _defineProperty(_mockFs, PATH_TO_TESTS + '/__snapshots__/multipleclasses.spec.unexpected-snap', fixtures.multipleclasses), _mockFs));
  });
  afterEach(function () {
    _mockFs2["default"].restore();
  });

  function initState(options) {
    state.testPath = _path["default"].join(PATH_TO_TESTS, options.testPath);
    state.currentTestName = options.testName;
    state.unexpectedSnapshot = null;

    if (options.update) {
      state.snapshotState.update = options.update;
    }

    _jestMatchers["default"].setState(state);
  }

  it('passes a single test snapshot', function () {
    initState({
      testPath: 'single.spec.js',
      testName: 'single test name'
    });

    var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));

    expect(renderer, 'to match snapshot');
    expect(_fs["default"].writeFileSync, 'was not called');
  });
  it('updates the `matched` count', function () {
    initState({
      testPath: 'single.spec.js',
      testName: 'single test name'
    });

    var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));

    expect(renderer, 'to match snapshot');
    expect(state.snapshotState, 'to satisfy', {
      matched: 1
    });
  });
  it('passes multiple test snapshots', function () {
    initState({
      testPath: 'single.spec.js',
      testName: 'single test name'
    });

    var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));

    expect(renderer, 'to match snapshot');
    expect(renderer, 'with event', 'click', 'to match snapshot');
    expect(_fs["default"].writeFileSync, 'was not called');
  });
  describe('for an unknown test', function () {
    var snapshotPath;
    beforeEach(function () {
      initState({
        testPath: 'single.spec.js',
        testName: 'a new test'
      });

      var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));

      snapshotPath = _path["default"].join(PATH_TO_TESTS, '__snapshots__/single.spec.unexpected-snap');
      expect(renderer, 'to match snapshot');
    });
    it('writes a new snapshot', function () {
      // Confirm we wrote the file with the old and new entries
      expect(_fs["default"].writeFileSync, 'to have a call satisfying', [snapshotPath, expect.it('to match', /exports\[`a new test 1`]/).and('to match', /exports\[`single test name 1`]/)]);
    });
    it('writes a new snapshot comment', function () {
      // Confirm we wrote the file with the old and new entries
      expect(_fs["default"].writeFileSync, 'to have a call satisfying', [snapshotPath, expect.it('to match', /\/\/ <button onClick={/).and('to match', /\/\/ <\/button>/).and('not to match', /\/\/\s*children:/)]);
    });
    it('creates the correct snapshot', function () {
      // Confirm it is parseable and contains the right thing
      var newSnapshot = loadSnapshotMock(snapshotPath);
      expect(newSnapshot['a new test 1'], 'to satisfy', {
        type: 'button',
        children: ['Clicked ', '0', ' times']
      });
    });
    it('increments the added count in the state', function () {
      expect(state, 'to satisfy', {
        snapshotState: {
          added: 1
        }
      });
    });
  });
  it('fails on a snapshot that doesn`t match', function () {
    initState({
      testPath: 'single.spec.js',
      testName: 'single test name'
    });

    var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));

    expect(function () {
      return expect(renderer, 'with event click', 'to match snapshot');
    }, 'to throw', ['expected', '<button onClick={function bound onClick() { /* native code */ }}>', '  Clicked 1 times', '</button>', 'with event click to match snapshot', '', '<button onClick={function bound onClick() { /* native code */ }}>', '  Clicked 1 times // -Clicked 1 times', '                  // +Clicked 0 times', '</button>'].join('\n'));
  });
  it('matches classes in the wrong order', function () {
    initState({
      testPath: 'multipleclasses.spec.js',
      testName: 'multiple classes'
    });

    var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
      className: "three two one"
    }));

    expect(renderer, 'to match snapshot');
  });
  it('diffs missing classes', function () {
    initState({
      testPath: 'multipleclasses.spec.js',
      testName: 'multiple classes'
    });

    var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
      className: "three one"
    }));

    expect(function () {
      return expect(renderer, 'to match snapshot');
    }, 'to throw', ['expected <button .../> to match snapshot', '', '<button className="three one" // missing class \'two\'', '   onClick={function bound onClick() { /* native code */ }}>', '  Clicked 0 times', '</button>'].join('\n'));
  });
  it('diffs extra classes', function () {
    initState({
      testPath: 'multipleclasses.spec.js',
      testName: 'multiple classes'
    });

    var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
      className: "three two one four"
    }));

    expect(function () {
      return expect(renderer, 'to match snapshot');
    }, 'to throw', ['expected <button .../> to match snapshot', '', '<button className="three two one four" // extra class \'four\'', '   onClick={function bound onClick() { /* native code */ }}>', '  Clicked 0 times', '</button>'].join('\n'));
  });
  it('diffs extra attributes', function () {
    initState({
      testPath: 'multipleclasses.spec.js',
      testName: 'multiple classes'
    });

    var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
      className: "three two one",
      ariaLabel: "testextra"
    }));

    expect(function () {
      return expect(renderer, 'to match snapshot');
    }, 'to throw', ['expected <button .../> to match snapshot', '', '<button className="three two one"', '   onClick={function bound onClick() { /* native code */ }}', '   ariaLabel="testextra" // ariaLabel should be removed', '>', '  Clicked 0 times', '</button>'].join('\n'));
  });
  it('allows extra attributes with `to satisfy snapshot`', function () {
    initState({
      testPath: 'multipleclasses.spec.js',
      testName: 'multiple classes'
    });

    var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
      className: "three two one",
      ariaLabel: "testextra"
    }));

    expect(renderer, 'to satisfy snapshot');
  });
  it('allows extra classes with `to satisfy snapshot`', function () {
    initState({
      testPath: 'multipleclasses.spec.js',
      testName: 'multiple classes'
    });

    var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
      className: "three two one four"
    }));

    expect(renderer, 'to satisfy snapshot');
  });
  it('allows extra classes with `to satisfy snapshot` after event ', function () {
    initState({
      testPath: 'multipleclasses.spec.js',
      testName: 'multiple classes click'
    });

    var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
      className: "three two one four"
    }));

    expect(renderer, 'with event click', 'to satisfy snapshot');
  });
  it('increments `unmatched` when a snapshot doesn`t match', function () {
    initState({
      testPath: 'single.spec.js',
      testName: 'single test name'
    });

    var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));

    expect(function () {
      return expect(renderer, 'with event click', 'to match snapshot');
    }, 'to throw');
    expect(state, 'to satisfy', {
      snapshotState: {
        unmatched: 1
      }
    });
  });
  describe('when update is true and the snapshot matches', function () {
    beforeEach(function () {
      initState({
        testPath: 'single.spec.js',
        testName: 'single test name',
        update: true
      });

      var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));

      expect(renderer, 'to match snapshot');
    });
    it('increments `matched`', function () {
      expect(state, 'to satisfy', {
        snapshotState: {
          updated: 0,
          added: 0,
          matched: 1,
          update: true
        }
      });
    });
  });
  describe('when update is true and the snapshot doesn`t match', function () {
    var snapshotPath;
    beforeEach(function () {
      initState({
        testPath: 'single.spec.js',
        testName: 'single test name',
        update: true
      });

      var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));

      snapshotPath = _path["default"].join(PATH_TO_TESTS, '__snapshots__/single.spec.unexpected-snap');
      expect(renderer, 'with event click', 'to match snapshot');
    });
    it('increments `updated`', function () {
      expect(state, 'to satisfy', {
        snapshotState: {
          updated: 1,
          added: 0,
          update: true
        }
      });
    });
    it('writes the new snapshot', function () {
      expect(_fs["default"].writeFileSync, 'to have calls satisfying', [[snapshotPath, expect.it('to match', /exports\[`single test name 1`]/)]]);
    });
    it('writes the new snapshot comment', function () {
      expect(_fs["default"].writeFileSync, 'to have calls satisfying', [[snapshotPath, expect.it('to match', /\/\/ <button onClick={/).and('to match', /\/\/ <\/button>/).and('not to match', /\/\/\s*children:/)]]);
    });
    it('writes the correct snapshot', function () {
      var snapshot = loadSnapshotMock(snapshotPath);
      expect(snapshot, 'to satisfy', {
        'single test name 1': {
          type: 'button',
          children: ['Clicked ', '1', ' times']
        }
      });
    });
  });
  describe('with functions', function () {
    it('compares with a snapshot with a normal function', function () {
      initState({
        testPath: 'withFunctions.spec.js',
        testName: 'with functions'
      });

      var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
        onMouseDown: _functions["default"].anonymous()
      }));

      expect(renderer, 'to match snapshot'); // Now reset state back such that it actually tests the snapshot

      initState({
        testPath: 'withFunctions.spec.js',
        testName: 'with functions'
      }); // Rerender, with a new instance of the anonymous function

      renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
        onMouseDown: _functions["default"].anonymous()
      }));
      expect(renderer, 'to match snapshot');
    });
    it('compares with a snapshot with a bound function', function () {
      initState({
        testPath: 'withFunctions.spec.js',
        testName: 'with functions'
      });

      var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
        onMouseDown: _functions["default"].boundContentArgs()
      }));

      expect(renderer, 'to match snapshot'); // Now reset state back such that it actually tests the snapshot

      initState({
        testPath: 'withFunctions.spec.js',
        testName: 'with functions'
      }); // Rerender, with a new instance of the function

      renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
        onMouseDown: _functions["default"].boundContentArgs()
      }));
      expect(renderer, 'to match snapshot');
    });
    it('fails with a snapshot with a normal function when the expected is bound', function () {
      initState({
        testPath: 'withFunctions.spec.js',
        testName: 'with functions'
      });

      var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
        onMouseDown: _functions["default"].boundContentArgs()
      })); // Create the snapshot with the bound function


      expect(renderer, 'to match snapshot'); // Now reset state back such that it actually tests the snapshot

      initState({
        testPath: 'withFunctions.spec.js',
        testName: 'with functions'
      }); // Rerender, with a different unbound function

      renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
        onMouseDown: _functions["default"].namedContentArgs()
      }));
      expect(function () {
        return expect(renderer, 'to match snapshot');
      }, 'to throw', ['expected <button .../> to match snapshot', '', '<button onClick={function bound onClick() { /* native code */ }}', '   onMouseDown={function doStuff(a, b) { /* ... */ }} // expected', '                                                      // function doStuff(a, b) {', '                                                      //   // comment', '                                                      //   return a + b;', '                                                      // }', '                                                      // to satisfy function bound bound3() { /* function body */ }', '                                                      //', '                                                      // -function doStuff(a, b) { /* function body */ }', '                                                      // +function bound bound3() { /* function body */ }', '>', '  Clicked 0 times', '</button>'].join('\n'));
    });
  });
  describe('removing unused keys', function () {
    it('removes the unused snapshot file when removeUnusedKeys is called', function () {
      initState({
        testPath: 'single.spec.js',
        testName: 'single test name',
        update: true
      });

      _sinon["default"].spy(_fs["default"], 'unlinkSync');

      try {
        // removeUncheckedKeys is called by Jest when update is true
        state.snapshotState.removeUncheckedKeys();
        expect(_fs["default"].unlinkSync, 'to have calls satisfying', [[_path["default"].join(PATH_TO_TESTS, '__snapshots__/single.spec.unexpected-snap')]]);
      } finally {
        _fs["default"].unlinkSync.restore();
      }
    });
    it('removes the unused keys of a test where only some are used', function () {
      initState({
        testPath: 'multiple.spec.js',
        testName: 'multi test two',
        update: true
      });

      var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));

      expect(renderer, 'with event click', 'to match snapshot');
      var originalSnapshot = loadSnapshotMock(_path["default"].join(PATH_TO_TESTS, '__snapshots__/multiple.spec.unexpected-snap'));
      state.snapshotState.removeUncheckedKeys();
      var newSnapshot = loadSnapshotMock(_path["default"].join(PATH_TO_TESTS, '__snapshots__/multiple.spec.unexpected-snap'));
      expect(Object.keys(originalSnapshot), 'to equal', ['multi test one 1', 'multi test two 1', 'multi test two 2']);
      expect(Object.keys(newSnapshot), 'to equal', ['multi test two 1']);
    });
    it('calls the original removeUncheckedKeys', function () {
      initState({
        testPath: 'multiple.spec.js',
        testName: 'multi test two',
        update: true
      });

      var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));

      expect(renderer, 'with event click', 'to match snapshot');
      state.snapshotState.removeUncheckedKeys();
      expect(removeUncheckedKeysStub, 'to have calls satisfying', [{
        args: [],
        'this': state.snapshotState
      }]);
    });
  });
  it('leaves snapshots of tests that failed', function () {
    initState({
      testPath: 'multiple.spec.js',
      testName: 'multi test two'
    });

    var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));

    expect(function () {
      return expect(renderer, 'to match snapshot');
    }, 'to throw');
    var originalSnapshot = loadSnapshotMock(_path["default"].join(PATH_TO_TESTS, '__snapshots__/multiple.spec.unexpected-snap'));
    state.snapshotState.removeUncheckedKeys();
    var newSnapshot = loadSnapshotMock(_path["default"].join(PATH_TO_TESTS, '__snapshots__/multiple.spec.unexpected-snap'));
    expect(Object.keys(originalSnapshot), 'to equal', ['multi test one 1', 'multi test two 1', 'multi test two 2']);
    expect(Object.keys(newSnapshot), 'to equal', ['multi test two 1', 'multi test two 2']);
  });
  it('removes a file if there are no snapshots', function () {
    initState({
      testPath: 'multiple.spec.js',
      testName: 'multi test two'
    });

    _sinon["default"].spy(_fs["default"], 'unlinkSync');

    try {
      state.snapshotState.removeUncheckedKeys();
      expect(_fs["default"].unlinkSync, 'to have calls satisfying', function () {
        _fs["default"].unlinkSync(_path["default"].join(PATH_TO_TESTS, '__snapshots__/multiple.spec.unexpected-snap'));
      });
    } finally {
      _fs["default"].unlinkSync.restore();
    }
  });
  it('shows an error message if the JSON is asserted on directly', function () {
    var renderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));

    expect(function () {
      return expect(renderer.toJSON(), 'to match snapshot');
    }, 'to throw', ['To assert snapshots, use the testRenderer directly, not the result of `.toJSON()`', 'e.g.', '  const testRenderer = ReactTestRenderer.create(<MyComponent />);', '  expect(testRenderer, \'to match snapshot\');'].join('\n'));
  });
});