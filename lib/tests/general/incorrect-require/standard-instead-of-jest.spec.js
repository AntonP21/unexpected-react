"use strict";

var _emulateDom = _interopRequireDefault(require("../../helpers/emulateDom"));

var _unexpected = _interopRequireDefault(require("unexpected"));

var _unexpectedReact = _interopRequireDefault(require("../../../unexpected-react"));

var _react = _interopRequireDefault(require("react"));

var _testUtils = _interopRequireDefault(require("react-dom/test-utils"));

var _ClickCounter = _interopRequireDefault(require("../../components/ClickCounter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var expect = _unexpected["default"].clone().use(_unexpectedReact["default"]);

describe('standard-instead-of-jest', function () {
  it('shows a helpful error message when asserting using `to match snapshot`', function () {
    expect(function () {
      return expect( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null), 'to match snapshot');
    }, 'to throw', ['To use the `to match snapshot` assertion with the shallow and full DOM renderers, require unexpected-react as `require(\'unexpected-react/jest\');`', '', ''].join('\n'));
  });
  it('shows a helpful error message when asserting using `to satisfy snapshot`', function () {
    expect(function () {
      return expect( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null), 'to satisfy snapshot');
    }, 'to throw', ['To use the `to satisfy snapshot` assertion with the shallow and full DOM renderers, require unexpected-react as `require(\'unexpected-react/jest\');`', '', ''].join('\n'));
  });
  it('shows a helpful error message after shallow rendering when asserting using `to match snapshot`', function () {
    expect(function () {
      return expect( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null), 'when rendered', 'to match snapshot');
    }, 'to throw', ['expected <ClickCounter /> when rendered', 'To use the `to match snapshot` assertion with the shallow and full DOM renderers, require unexpected-react as `require(\'unexpected-react/jest\');`', '', ''].join('\n'));
  });
  it('shows a helpful error message when asserting using `to satisfy snapshot`', function () {
    expect(function () {
      return expect( /*#__PURE__*/_react["default"].createElement(_ClickCounter["default"], null), 'when rendered', 'to satisfy snapshot');
    }, 'to throw', ['expected <ClickCounter /> when rendered', 'To use the `to satisfy snapshot` assertion with the shallow and full DOM renderers, require unexpected-react as `require(\'unexpected-react/jest\');`', '', ''].join('\n'));
  });
});