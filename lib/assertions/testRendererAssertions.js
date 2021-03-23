"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installInto = installInto;

var _reactTestRenderer = require("react-test-renderer");

var _unexpectedHtmllikeJsxAdapter = _interopRequireDefault(require("unexpected-htmllike-jsx-adapter"));

var _unexpectedHtmllikeTestrendererAdapter = _interopRequireDefault(require("unexpected-htmllike-testrenderer-adapter"));

var TestRendererTypeWrapper = _interopRequireWildcard(require("../types/test-renderer-type-wrapper"));

var _AssertionGenerator = _interopRequireDefault(require("./AssertionGenerator"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function installInto(expect) {
  function triggerEvent(renderer, target, eventName, eventArgs) {
    if (!target) {
      target = renderer.toJSON();
    }

    var handlerPropName = 'on' + eventName[0].toUpperCase() + eventName.substr(1);
    var handler = target.props[handlerPropName];

    if (typeof handler !== 'function') {
      return expect.fail({
        diff: function diff(output) {
          return output.error('No handler function prop ').text("'" + handlerPropName + "'").error(' on the target element');
        }
      });
    }

    (0, _reactTestRenderer.act)(function () {
      return handler(eventArgs);
    });
    return renderer;
  }

  var assertionGenerator = new _AssertionGenerator["default"]({
    ActualAdapter: _unexpectedHtmllikeTestrendererAdapter["default"],
    QueryAdapter: _unexpectedHtmllikeJsxAdapter["default"],
    ExpectedAdapter: _unexpectedHtmllikeJsxAdapter["default"],
    actualTypeName: 'ReactTestRenderer',
    queryTypeName: 'ReactElement',
    expectedTypeName: 'ReactElement',
    getRenderOutput: function getRenderOutput(renderer) {
      return TestRendererTypeWrapper.getTestRendererOutputWrapper(renderer);
    },
    actualRenderOutputType: 'ReactTestRendererOutput',
    getDiffInputFromRenderOutput: function getDiffInputFromRenderOutput(renderOutput) {
      return TestRendererTypeWrapper.getRendererOutputJson(renderOutput);
    },
    rewrapResult: function rewrapResult(renderer, target) {
      return TestRendererTypeWrapper.rewrapResult(renderer, target);
    },
    triggerEvent: triggerEvent
  });
  assertionGenerator.installInto(expect);
  return assertionGenerator;
}