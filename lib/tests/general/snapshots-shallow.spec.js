'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _unexpected = _interopRequireDefault(require("unexpected"));

var _unexpectedSinon = _interopRequireDefault(require("unexpected-sinon"));

var _mockJasmine = _interopRequireDefault(require("../helpers/mock-jasmine"));

var _jestMatchers = _interopRequireDefault(require("jest-matchers"));

var _jest = _interopRequireDefault(require("../../jest"));

var _ClickCounter = _interopRequireDefault(require("../components/ClickCounter"));

var _fs = _interopRequireDefault(require("fs"));

var _mockFs2 = _interopRequireDefault(require("mock-fs"));

var _module = _interopRequireDefault(require("module"));

var _path = _interopRequireDefault(require("path"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _shallow = require("react-test-renderer/shallow");

var _sinon = _interopRequireDefault(require("sinon"));

var _snapshotLoader = require("../../helpers/snapshotLoader");

var _functions = _interopRequireDefault(require("../fixtures/functions"));

var _snapshots = require("../../helpers/snapshots");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

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
  var renderer;
  before(function () {
    return _fs["default"].readdirAsync(_path["default"].join(__dirname, '../fixtures')).then(function (dirList) {
      return _bluebird["default"].all(dirList.map(function (entry) {
        return _fs["default"].readFileAsync(_path["default"].join(__dirname, '../fixtures', entry)).then(function (data) {
          fixtures[_path["default"].basename(entry, '.snapshot')] = data.toString('utf-8');
        });
      }));
    });
  });
  beforeEach(function () {
    renderer = (0, _shallow.createRenderer)();
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

    if (options.updatev20) {
      state.snapshotState._updateSnapshot = options.updatev20;
    }

    _jestMatchers["default"].setState(state);
  }

  it('passes a single test snapshot', function () {
    initState({
      testPath: 'single.spec.js',
      testName: 'single test name'
    });
    renderer.render( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));
    expect(renderer, 'to match snapshot');
    expect(_fs["default"].writeFileSync, 'was not called');
  });
  it('fails on a snapshot that doesn`t match', function () {
    initState({
      testPath: 'single.spec.js',
      testName: 'single test name'
    });
    renderer.render( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));
    expect(function () {
      return expect(renderer, 'with event click', 'to match snapshot');
    }, 'to throw', ['expected', '<button onClick={function bound onClick() { /* native code */ }}>', '  Clicked 1 times', '</button>', 'with event click to match snapshot', '', '<button onClick={function bound onClick() { /* native code */ }}>', '  Clicked 1 times // -Clicked 1 times', '                  // +Clicked 0 times', '</button>'].join('\n'));
  });
  it('fails when an extra class is provided', function () {
    initState({
      testPath: 'multipleclasses.spec.js',
      testName: 'multiple classes'
    });
    renderer.render( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
      className: "one four three two"
    }));
    expect(function () {
      return expect(renderer, 'to match snapshot');
    }, 'to throw', ['expected <button .../> to match snapshot', '', '<button className="one four three two" // extra class \'four\'', '   onClick={function bound onClick() { /* native code */ }}>', '  Clicked 0 times', '</button>'].join('\n'));
  });
  it('fails when an extra attribute is provided', function () {
    initState({
      testPath: 'multipleclasses.spec.js',
      testName: 'multiple classes'
    });
    renderer.render( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
      className: "one three two",
      ariaLabel: "test"
    }));
    expect(function () {
      return expect(renderer, 'to match snapshot');
    }, 'to throw', ['expected <button .../> to match snapshot', '', '<button className="one three two"', '   onClick={function bound onClick() { /* native code */ }}', '   ariaLabel="test" // ariaLabel should be removed', '>', '  Clicked 0 times', '</button>'].join('\n'));
  });
  it('passes with `to satisfy snapshot` when an extra class is provided', function () {
    initState({
      testPath: 'multipleclasses.spec.js',
      testName: 'multiple classes'
    });
    renderer.render( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
      className: "one four three two"
    }));
    expect(renderer, 'to satisfy snapshot');
  });
  it('passes with `to satisfy snapshot` when an extra attribute is provided', function () {
    initState({
      testPath: 'multipleclasses.spec.js',
      testName: 'multiple classes'
    });
    renderer.render( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
      className: "one three two",
      ariaLabel: "test"
    }));
    expect(renderer, 'to satisfy snapshot');
  });
  describe('when update is true and the snapshot doesn`t match', function () {
    var snapshotPath;
    beforeEach(function () {
      initState({
        testPath: 'single.spec.js',
        testName: 'single test name',
        update: true
      });
      renderer.render( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));
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
  describe('when update for jest v20 is `all` and the snapshot doesn`t match', function () {
    var snapshotPath;
    beforeEach(function () {
      initState({
        testPath: 'single.spec.js',
        testName: 'single test name',
        updatev20: 'all'
      });
      renderer.render( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));
      snapshotPath = _path["default"].join(PATH_TO_TESTS, '__snapshots__/single.spec.unexpected-snap');
      expect(renderer, 'with event click', 'to match snapshot');
    });
    it('increments `updated`', function () {
      expect(state, 'to satisfy', {
        snapshotState: {
          updated: 1,
          added: 0,
          _updateSnapshot: 'all'
        }
      });
    });
    it('writes the new snapshot', function () {
      expect(_fs["default"].writeFileSync, 'to have calls satisfying', [[snapshotPath, expect.it('to match', /exports\[`single test name 1`]/)]]);
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
  describe('when update for jest v20 is `new` and the snapshot doesn`t match', function () {
    var snapshotPath;
    beforeEach(function () {
      initState({
        testPath: 'single.spec.js',
        testName: 'single test name',
        updatev20: 'new'
      });
      renderer.render( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));
      snapshotPath = _path["default"].join(PATH_TO_TESTS, '__snapshots__/single.spec.unexpected-snap');
      expect(function () {
        return expect(renderer, 'with event click', 'to match snapshot');
      }, 'to throw');
    });
    it('does not increment `updated`', function () {
      expect(state, 'to satisfy', {
        snapshotState: {
          updated: 0,
          added: 0,
          unmatched: 1,
          _updateSnapshot: 'new'
        }
      });
    });
    it('does not write a new snapshot', function () {
      expect(_fs["default"].writeFileSync, 'to have calls satisfying', []);
    });
  });
  describe('when update for jest v20 is `new` and the snapshot is for a new test', function () {
    var snapshotPath;
    beforeEach(function () {
      initState({
        testPath: 'single.spec.js',
        testName: 'new test name',
        updatev20: 'new'
      });
      renderer.render( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));
      snapshotPath = _path["default"].join(PATH_TO_TESTS, '__snapshots__/single.spec.unexpected-snap');
      expect(renderer, 'with event click', 'to match snapshot');
    });
    it('increments `added`', function () {
      expect(state, 'to satisfy', {
        snapshotState: {
          updated: 0,
          added: 1,
          unmatched: 0,
          _updateSnapshot: 'new'
        }
      });
    });
    it('writes the new snapshot', function () {
      expect(_fs["default"].writeFileSync, 'to have calls satisfying', [[snapshotPath, expect.it('to match', /exports\[`new test name 1`]/)]]);
    });
    it('writes the correct snapshot', function () {
      var snapshot = loadSnapshotMock(snapshotPath);
      expect(snapshot, 'to satisfy', {
        'new test name 1': {
          type: 'button',
          children: ['Clicked ', '1', ' times']
        }
      });
    });
  });
  describe('when update for jest v20 is `none` and the snapshot is for a new test', function () {
    var snapshotPath;
    beforeEach(function () {
      initState({
        testPath: 'single.spec.js',
        testName: 'new test name',
        updatev20: 'none'
      });
      renderer.render( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));
      snapshotPath = _path["default"].join(PATH_TO_TESTS, '__snapshots__/single.spec.unexpected-snap');
      expect(function () {
        return expect(renderer, 'with event click', 'to match snapshot');
      }, 'to throw', ['expected', '<button onClick={function bound onClick() { /* native code */ }}>', '  Clicked 1 times', '</button>', 'with event click to match snapshot', '', 'No snapshot available, but running with `--ci`'].join('\n'));
    });
    it('increments `unmatched`', function () {
      expect(state, 'to satisfy', {
        snapshotState: {
          updated: 0,
          added: 0,
          unmatched: 1,
          _updateSnapshot: 'none'
        }
      });
    });
    it('does not write the new snapshot', function () {
      expect(_fs["default"].writeFileSync, 'to have calls satisfying', []);
    });
  });
  describe('when update for jest v20 is `new` and the snapshot is for a existing test', function () {
    var snapshotPath;
    beforeEach(function () {
      initState({
        testPath: 'single.spec.js',
        testName: 'single test name',
        updatev20: 'new'
      });
      renderer.render( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));
      snapshotPath = _path["default"].join(PATH_TO_TESTS, '__snapshots__/single.spec.unexpected-snap');
      expect(state.snapshotState.getUncheckedCount(), 'to equal', 0);
      expect(renderer, 'to match snapshot');
    });
    it('increments `matched`', function () {
      expect(state, 'to satisfy', {
        snapshotState: {
          updated: 0,
          added: 0,
          matched: 1,
          _updateSnapshot: 'new'
        }
      });
    });
    it('does not write the new snapshot', function () {
      expect(_fs["default"].writeFileSync, 'to have calls satisfying', []);
    });
    it('leaves unchecked as 1', function () {
      expect(state.snapshotState.getUncheckedCount(), 'to equal', 1);
    });
    it('reduces unchecked to 0 after checking the second snapshot', function () {
      expect(renderer, 'with event', 'click', 'to match snapshot');
      expect(state.snapshotState.getUncheckedCount(), 'to equal', 0);
    });
  });
  describe('with functions', function () {
    it('compares with a snapshot with a normal function', function () {
      initState({
        testPath: 'withFunctions.spec.js',
        testName: 'with functions'
      });
      renderer.render( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
        onMouseDown: _functions["default"].anonymous()
      }));
      expect(renderer, 'to match snapshot'); // Now reset state back such that it actually tests the snapshot

      initState({
        testPath: 'withFunctions.spec.js',
        testName: 'with functions'
      }); // Rerender, with a new instance of the anonymous function

      renderer.render( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
        onMouseDown: _functions["default"].anonymous()
      }));
      expect(renderer, 'to match snapshot');
    });
    it('compares with a snapshot with a bound function', function () {
      initState({
        testPath: 'withFunctions.spec.js',
        testName: 'with functions'
      });
      renderer.render( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
        onMouseDown: _functions["default"].boundContentArgs()
      }));
      expect(renderer, 'to match snapshot'); // Now reset state back such that it actually tests the snapshot

      initState({
        testPath: 'withFunctions.spec.js',
        testName: 'with functions'
      }); // Rerender, with a new instance of the function

      renderer.render( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
        onMouseDown: _functions["default"].boundContentArgs()
      }));
      expect(renderer, 'to match snapshot');
    });
    it('fails with a snapshot with a normal function when the expected is bound', function () {
      initState({
        testPath: 'withFunctions.spec.js',
        testName: 'with functions'
      });
      renderer.render( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
        onMouseDown: _functions["default"].boundContentArgs()
      })); // Create the snapshot with the bound function

      expect(renderer, 'to match snapshot'); // Now reset state back such that it actually tests the snapshot

      initState({
        testPath: 'withFunctions.spec.js',
        testName: 'with functions'
      }); // Rerender, with a different unbound function

      renderer.render( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
        onMouseDown: _functions["default"].namedContentArgs()
      }));
      expect(function () {
        return expect(renderer, 'to match snapshot');
      }, 'to throw', ['expected <button .../> to match snapshot', '', '<button onClick={function bound onClick() { /* native code */ }}', '   onMouseDown={function doStuff(a, b) { /* ... */ }} // expected', '                                                      // function doStuff(a, b) {', '                                                      //   // comment', '                                                      //   return a + b;', '                                                      // }', '                                                      // to satisfy function bound bound3() { /* function body */ }', '                                                      //', '                                                      // -function doStuff(a, b) { /* function body */ }', '                                                      // +function bound bound3() { /* function body */ }', '>', '  Clicked 0 times', '</button>'].join('\n'));
    });
  });
  describe('with ReactElement as a prop', function () {
    var RenderProp = /*#__PURE__*/function (_React$Component) {
      _inherits(RenderProp, _React$Component);

      var _super = _createSuper(RenderProp);

      function RenderProp() {
        _classCallCheck(this, RenderProp);

        return _super.apply(this, arguments);
      }

      _createClass(RenderProp, [{
        key: "render",
        value: function render() {
          return /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], {
            message: this.props.message
          });
        }
      }]);

      return RenderProp;
    }(_react["default"].Component);

    it('stores a valid snapshot', function () {
      initState({
        testPath: 'withElements.spec.js',
        testName: 'with elements'
      });
      renderer.render( /*#__PURE__*/_react["default"].createElement(RenderProp, {
        message: /*#__PURE__*/_react["default"].createElement("span", {
          className: "foo bar"
        }, "Magic")
      })); // Create the snapshot

      expect(renderer, 'to match snapshot');

      var snapshotPath = _path["default"].join(PATH_TO_TESTS, '__snapshots__/withElements.spec.unexpected-snap');

      var snapshot = loadSnapshotMock(snapshotPath);
      expect(snapshot, 'to satisfy', {
        'with elements 1': {
          type: 'ClickCounter',
          props: {
            message: /*#__PURE__*/_react["default"].createElement("span", {
              className: "foo bar"
            }, "Magic")
          },
          children: []
        }
      });
    });
    it('validates a re-render with a message displaying the prop correctly', function () {
      initState({
        testPath: 'withElements.spec.js',
        testName: 'with elements'
      });
      renderer.render( /*#__PURE__*/_react["default"].createElement(RenderProp, {
        message: /*#__PURE__*/_react["default"].createElement("span", {
          className: "foo bar"
        }, "Magic")
      })); // Create the snapshot

      expect(renderer, 'to match snapshot');
      initState({
        testPath: 'withElements.spec.js',
        testName: 'with elements'
      }); // Removed a class

      renderer.render( /*#__PURE__*/_react["default"].createElement(RenderProp, {
        message: /*#__PURE__*/_react["default"].createElement("span", {
          className: "bar"
        }, "Magic")
      })); // Validate the snapshot

      expect(function () {
        return expect(renderer, 'to match snapshot');
      }, 'to throw', ['expected <ClickCounter .../> to match snapshot', '', '<ClickCounter', '   message={<span className="bar">Magic</span>} // expected <span className="bar">Magic</span>', '                                                // to satisfy <span className="foo bar">Magic</span>', '                                                //', '                                                // <span className="bar" // missing class \'foo\'', '                                                // >', '                                                //   Magic', '                                                // </span>', '/>'].join('\n'));
    });
    it('compares the prop with `to satisfy` also when it`s a ReactElement', function () {
      initState({
        testPath: 'withElements.spec.js',
        testName: 'with elements'
      });
      renderer.render( /*#__PURE__*/_react["default"].createElement(RenderProp, {
        message: /*#__PURE__*/_react["default"].createElement("span", {
          className: "bar foo"
        }, "Magic")
      })); // Create the snapshot

      expect(renderer, 'to match snapshot');
      initState({
        testPath: 'withElements.spec.js',
        testName: 'with elements'
      }); // switched class order

      renderer.render( /*#__PURE__*/_react["default"].createElement(RenderProp, {
        message: /*#__PURE__*/_react["default"].createElement("span", {
          className: "bar foo"
        }, "Magic")
      })); // Validate the snapshot

      expect(renderer, 'to match snapshot');
    });
  });
});