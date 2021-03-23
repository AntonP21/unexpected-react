"use strict";

var _unexpected = _interopRequireDefault(require("unexpected"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactTestRenderer = _interopRequireDefault(require("react-test-renderer"));

var _testRenderer = _interopRequireDefault(require("../../../test-renderer"));

var _ClickCounter = _interopRequireDefault(require("../../components/ClickCounter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var expect = _unexpected["default"].clone().installPlugin(_testRenderer["default"]);

expect.output.preferredWidth = 80;
describe('test-renderer-instead-of-test-renderer-jest', function () {
  it('shows a helpful error message when asserting using `to match snapshot`', function () {
    var testRenderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));

    expect(function () {
      return expect(testRenderer, 'to match snapshot');
    }, 'to throw', 'To use the `to match snapshot` assertion with the test renderer, require unexpected-react as `require(\'unexpected-react/test-renderer-jest\');`');
  });
  it('shows a helpful error message when asserting using `to satisfy snapshot`', function () {
    var testRenderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));

    expect(function () {
      return expect(testRenderer, 'to satisfy snapshot');
    }, 'to throw', 'To use the `to satisfy snapshot` assertion with the test renderer, require unexpected-react as `require(\'unexpected-react/test-renderer-jest\');`');
  });
  it('shows a helpful error message when asserting using `to match snapshot` and the JSON output', function () {
    var testRenderer = _reactTestRenderer["default"].create( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null));

    expect(function () {
      return expect(testRenderer.toJSON(), 'to match snapshot');
    }, 'to throw', ['To use the `to match snapshot` assertion with the test renderer, require unexpected-react as `require(\'unexpected-react/test-renderer-jest\');`', '', 'Also, don\'t pass the JSON, pass the test renderer directly'].join('\n'));
  });
});