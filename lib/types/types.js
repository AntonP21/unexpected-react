"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _unexpectedHtmllike = _interopRequireDefault(require("unexpected-htmllike"));

var _unexpectedHtmllikeJsxAdapter = _interopRequireDefault(require("unexpected-htmllike-jsx-adapter"));

var _unexpectedHtmllikeTestrendererAdapter = _interopRequireDefault(require("unexpected-htmllike-testrenderer-adapter"));

var _unexpectedHtmllikeRawAdapter = _interopRequireDefault(require("unexpected-htmllike-raw-adapter"));

var TestRendererTypeWrapper = _interopRequireWildcard(require("./test-renderer-type-wrapper"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function installInto(expect) {
  var reactElementAdapter = new _unexpectedHtmllikeJsxAdapter["default"]({
    convertToString: true,
    concatTextContent: true
  });
  var htmlLikeReactElement = (0, _unexpectedHtmllike["default"])(reactElementAdapter);
  var testRendererAdapter = new _unexpectedHtmllikeTestrendererAdapter["default"]({
    convertToString: true,
    concatTextContent: true
  });
  var htmlLikeTestRenderer = (0, _unexpectedHtmllike["default"])(testRendererAdapter);
  var rawAdapter = new _unexpectedHtmllikeRawAdapter["default"]({
    convertToString: true,
    concatTextContent: true
  });
  var htmlLikeRaw = (0, _unexpectedHtmllike["default"])(rawAdapter);
  expect.addType({
    name: 'ReactElement',
    identify: function identify(value) {
      return /*#__PURE__*/_react["default"].isValidElement(value) || _typeof(value) === 'object' && value !== null && (typeof value.type === 'function' || typeof value.type === 'string') && typeof value.hasOwnProperty === 'function' && value.hasOwnProperty('props') && value.hasOwnProperty('ref') && value.hasOwnProperty('key');
    },
    inspect: function inspect(value, depth, output, _inspect) {
      return htmlLikeReactElement.inspect(value, depth, output, _inspect);
    }
  });
  expect.addType({
    name: 'ReactModule',
    identify: function identify(value) {
      return _typeof(value) === 'object' && value !== null && typeof value.hasOwnProperty === 'function' && value.hasOwnProperty('createElement') && value.hasOwnProperty('cloneElement') && value.hasOwnProperty('createFactory') && value.hasOwnProperty('isValidElement');
    },
    inspect: function inspect(value, depth, output) {
      output.text('<<ReactModule>>');
    }
  });
  expect.addType({
    name: 'ReactShallowRenderer',
    base: 'object',
    identify: function identify(value) {
      return _typeof(value) === 'object' && value !== null && typeof value.getRenderOutput === 'function';
    },
    inspect: function inspect(value, depth, output, _inspect2) {
      output.append(_inspect2(value.getRenderOutput()));
    }
  });
  expect.addType({
    name: 'ReactTestRenderer',
    base: 'object',
    identify: function identify(value) {
      return value && _typeof(value) === 'object' && typeof value.hasOwnProperty === 'function' && typeof value.toJSON === 'function' && typeof value.unmount === 'function' && typeof value.update === 'function' && typeof value.getInstance === 'function';
    },
    inspect: function inspect(value, depth, output, _inspect3) {
      output.append(_inspect3(TestRendererTypeWrapper.getTestRendererOutputWrapper(value)));
    }
  });
  expect.addType({
    name: 'ReactTestRendererOutput',
    base: 'object',
    identify: function identify(value) {
      return TestRendererTypeWrapper.isTestRendererOutputWrapper(value);
    },
    inspect: function inspect(value, depth, output, _inspect4) {
      return htmlLikeTestRenderer.inspect(TestRendererTypeWrapper.getRendererOutputJson(value), depth, output, _inspect4);
    }
  });
  expect.addType({
    name: 'RawReactTestRendererJson',
    base: 'object',
    identify: function identify(value) {
      return value && _typeof(value) === 'object' && value.props && value.children && value.type;
    }
  });
  expect.addType({
    name: 'ReactRawObjectElement',
    base: 'RawReactTestRendererJson',
    identify: function identify(value) {
      return rawAdapter.isRawElement(value);
    },
    inspect: function inspect(value, depth, output, _inspect5) {
      return htmlLikeRaw.inspect(value, depth, output, _inspect5);
    }
  });
}

var _default = {
  installInto: installInto
};
exports["default"] = _default;