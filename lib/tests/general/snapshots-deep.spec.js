'use strict';

var _unexpected = _interopRequireDefault(require("unexpected"));

var _unexpectedSinon = _interopRequireDefault(require("unexpected-sinon"));

var _mockJasmine = _interopRequireDefault(require("../helpers/mock-jasmine"));

var _jestMatchers = _interopRequireDefault(require("jest-matchers"));

var _jest = _interopRequireDefault(require("../../jest"));

require("../helpers/emulateDom");

var _ClickCounter = _interopRequireDefault(require("../components/ClickCounter"));

var _TwoClickCounters = _interopRequireDefault(require("../components/TwoClickCounters"));

var _fs = _interopRequireDefault(require("fs"));

var _mockFs2 = _interopRequireDefault(require("mock-fs"));

var _module = _interopRequireDefault(require("module"));

var _path = _interopRequireDefault(require("path"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _testUtils = _interopRequireDefault(require("react-dom/test-utils"));

var _sinon = _interopRequireDefault(require("sinon"));

var _snapshotLoader = require("../../helpers/snapshotLoader");

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

var expect = _unexpected["default"].clone().use(_jest["default"]).use(_unexpectedSinon["default"]);

expect.output.preferredWidth = 80;

_bluebird["default"].promisifyAll(_fs["default"]);

var fixtures = {};
describe('snapshots', function () {
  var PATH_TO_TESTS = '/path/to/tests';
  var state, removeUncheckedKeysStub;
  before(function () {
    var dirList = _fs["default"].readdirSync(_path["default"].join(__dirname, '../fixtures'));

    dirList.map(function (entry) {
      var data = _fs["default"].readFileSync(_path["default"].join(__dirname, '../fixtures', entry));

      fixtures[_path["default"].basename(entry, '.snapshot')] = data.toString('utf-8');
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
    (0, _mockFs2["default"])(_defineProperty({}, PATH_TO_TESTS + '/__snapshots__/twoclicks.spec.unexpected-snap', fixtures.twoclicks));
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
      testPath: 'twoclicks.spec.js',
      testName: 'two counters'
    });

    var component = _testUtils["default"].renderIntoDocument( /*#__PURE__*/_react["default"].createElement(_TwoClickCounters["default"], null));

    expect(component, 'to match snapshot');
    expect(_fs["default"].writeFileSync, 'was not called');
  });
  it('fails on a snapshot that doesn`t match', function () {
    initState({
      testPath: 'twoclicks.spec.js',
      testName: 'two counters'
    });

    var component = _testUtils["default"].renderIntoDocument( /*#__PURE__*/_react["default"].createElement(_TwoClickCounters["default"], null));

    expect(function () {
      return expect(component, 'with event click', 'on', /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
        className: "one"
      }), 'to match snapshot');
    }, 'to throw', ['expected', '<TwoClickCounters>', '  <div>', '    <ClickCounter className="one">', '      <button className="one" onClick={function bound onClick() { /* native code */ }}>', '        Clicked 1 times', '      </button>', '    </ClickCounter>', '    <ClickCounter className="two">', '      <button className="two" onClick={function bound onClick() { /* native code */ }}>', '        Clicked 0 times', '      </button>', '    </ClickCounter>', '  </div>', '</TwoClickCounters>', 'with event click on <ClickCounter className="one" /> to match snapshot', '', '<TwoClickCounters>', '  <div>', '    <ClickCounter className="one">', '      <button className="one" onClick={function bound onClick() { /* native code */ }}>', '        Clicked 1 times // -Clicked 1 times', '                        // +Clicked 0 times', '      </button>', '    </ClickCounter>', '    <ClickCounter className="two">', '      <button className="two" onClick={function bound onClick() { /* native code */ }}>', '        Clicked 0 times', '      </button>', '    </ClickCounter>', '  </div>', '</TwoClickCounters>'].join('\n'));
  });
  describe('when update is true and the snapshot doesn`t match', function () {
    var snapshotPath, component;
    beforeEach(function () {
      initState({
        testPath: 'twoclicks.spec.js',
        testName: 'two counters',
        update: true
      });
      component = _testUtils["default"].renderIntoDocument( /*#__PURE__*/_react["default"].createElement(_TwoClickCounters["default"], null));
      snapshotPath = _path["default"].join(PATH_TO_TESTS, '__snapshots__/twoclicks.spec.unexpected-snap');
      expect(component, 'with event click', 'on', /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
        className: "one"
      }), 'to match snapshot');
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
      expect(_fs["default"].writeFileSync, 'to have calls satisfying', [[snapshotPath, expect.it('to match', /exports\[`two counters 1`]/)]]);
    });
    it('writes the correct snapshot', function () {
      var snapshot = loadSnapshotMock(snapshotPath);
      expect(snapshot, 'to satisfy', {
        'two counters 1': {
          type: 'TwoClickCounters',
          children: [{
            type: 'div',
            children: [{
              type: 'ClickCounter'
            }, {
              type: 'ClickCounter'
            }]
          }]
        }
      });
    });
  });
  describe('with functions', function () {
    var component;
    it('compares with a snapshot with a normal function', function () {
      initState({
        testPath: 'withFunctions.spec.js',
        testName: 'with functions'
      });
      component = _testUtils["default"].renderIntoDocument( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
        onMouseDown: _functions["default"].anonymous()
      }));
      expect(component, 'to match snapshot'); // Now reset state back such that it actually tests the snapshot

      initState({
        testPath: 'withFunctions.spec.js',
        testName: 'with functions'
      }); // Rerender, with a new instance of the anonymous function

      component = _testUtils["default"].renderIntoDocument( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
        onMouseDown: _functions["default"].anonymous()
      }));
      expect(component, 'to match snapshot');
    });
    it('compares with a snapshot with a bound function', function () {
      initState({
        testPath: 'withFunctions.spec.js',
        testName: 'with functions'
      });
      component = _testUtils["default"].renderIntoDocument( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
        onMouseDown: _functions["default"].boundContentArgs()
      }));
      expect(component, 'to match snapshot'); // Now reset state back such that it actually tests the snapshot

      initState({
        testPath: 'withFunctions.spec.js',
        testName: 'with functions'
      }); // Rerender, with a new instance of the function

      component = _testUtils["default"].renderIntoDocument( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
        onMouseDown: _functions["default"].boundContentArgs()
      }));
      expect(component, 'to match snapshot');
    });
    it('fails with a snapshot with a normal function when the expected is bound', function () {
      initState({
        testPath: 'withFunctions.spec.js',
        testName: 'with functions'
      });
      component = _testUtils["default"].renderIntoDocument( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
        onMouseDown: _functions["default"].boundContentArgs()
      })); // Create the snapshot with the bound function

      expect(component, 'to match snapshot'); // Now reset state back such that it actually tests the snapshot

      initState({
        testPath: 'withFunctions.spec.js',
        testName: 'with functions'
      }); // Rerender, with a different unbound function

      component = _testUtils["default"].renderIntoDocument( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
        onMouseDown: _functions["default"].namedContentArgs()
      }));
      expect(function () {
        return expect(component, 'to match snapshot');
      }, 'to throw', ['expected <ClickCounter .../> to match snapshot', '', '<ClickCounter', '   onMouseDown={function doStuff(a, b) { /* ... */ }} // expected', '                                                      // function doStuff(a, b) {', '                                                      //   // comment', '                                                      //   return a + b;', '                                                      // }', '                                                      // to satisfy function bound bound3() { /* function body */ }', '                                                      //', '                                                      // -function doStuff(a, b) { /* function body */ }', '                                                      // +function bound bound3() { /* function body */ }', '>', '  <button onClick={function bound onClick() { /* native code */ }}', '     onMouseDown={function doStuff(a, b) { /* ... */ }} // expected', '                                                        // function doStuff(a, b) {', '                                                        //   // comment', '                                                        //   return a + b;', '                                                        // }', '                                                        // to satisfy function bound bound3() { /* function body */ }', '                                                        //', '                                                        // -function doStuff(a, b) { /* function body */ }', '                                                        // +function bound bound3() { /* function body */ }', '  >', '    Clicked 0 times', '  </button>', '</ClickCounter>'].join('\n'));
    });
  });
});