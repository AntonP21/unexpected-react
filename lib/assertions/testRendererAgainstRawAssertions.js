"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installInto = installInto;
exports.installAsAlternative = installAsAlternative;
exports.triggerEvent = triggerEvent;

var _unexpectedHtmllikeRawAdapter = _interopRequireDefault(require("unexpected-htmllike-raw-adapter"));

var _unexpectedHtmllikeTestrendererAdapter = _interopRequireDefault(require("unexpected-htmllike-testrenderer-adapter"));

var TestRendererTypeWrapper = _interopRequireWildcard(require("../types/test-renderer-type-wrapper"));

var _AssertionGenerator = _interopRequireDefault(require("./AssertionGenerator"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function triggerEvent(expect, renderer, target, eventName, eventArgs) {
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

  handler(eventArgs);
  return renderer;
}

function getOptions(expect) {
  return {
    ActualAdapter: _unexpectedHtmllikeTestrendererAdapter["default"],
    ExpectedAdapter: _unexpectedHtmllikeRawAdapter["default"],
    actualTypeName: 'ReactTestRenderer',
    expectedTypeName: 'ReactRawObjectElement',
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
    triggerEvent: triggerEvent.bind(expect)
  };
}

function installInto(expect) {
  var assertionGenerator = new _AssertionGenerator["default"](getOptions(expect));
  assertionGenerator.installInto(expect);
}

function installAsAlternative(expect, mainAssertionGenerator) {
  var generatorOptions = getOptions(expect);
  var assertionGenerator = new _AssertionGenerator["default"](_objectSpread({
    mainAssertionGenerator: mainAssertionGenerator
  }, generatorOptions));
  assertionGenerator.installAlternativeExpected(expect);
}