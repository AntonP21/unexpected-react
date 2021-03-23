"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _reactRenderHook = _interopRequireDefault(require("react-render-hook"));

var _react = _interopRequireDefault(require("react"));

var _unexpectedHtmllike = _interopRequireDefault(require("unexpected-htmllike"));

var _unexpectedHtmllikeReactrenderedAdapter = _interopRequireDefault(require("unexpected-htmllike-reactrendered-adapter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function installInto(expect) {
  var renderedReactElementAdapter = new _unexpectedHtmllikeReactrenderedAdapter["default"]({
    convertToString: true,
    concatTextContent: true
  });
  var htmlLikeRenderedReactElement = (0, _unexpectedHtmllike["default"])(renderedReactElementAdapter);
  expect.addType({
    name: 'RenderedReactElement',
    identify: function identify(value) {
      return _typeof(value) === 'object' && value !== null && (value._reactInternalInstance || value._reactInternalComponent) && (typeof value.setState === 'function' || _typeof(value.updater) === 'object'
      /* stateless components */
      );
    },
    inspect: function inspect(value, depth, output, _inspect) {
      var data = _reactRenderHook["default"].findComponent(value);

      return htmlLikeRenderedReactElement.inspect(data, depth, output, _inspect);
    }
  });
  expect.addType({
    name: 'RenderedReactElementData',
    identify: function identify(value) {
      return _typeof(value) === 'object' && value !== null && value.internalInstance && value.data && value.data.type && value.data.nodeType;
    },
    inspect: function inspect(value, depth, output, _inspect2) {
      return htmlLikeRenderedReactElement.inspect(value, depth, output, _inspect2);
    }
  });
}

var _default = {
  installInto: installInto
};
exports["default"] = _default;