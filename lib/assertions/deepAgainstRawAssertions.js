"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installInto = installInto;
exports.installAsAlternative = installAsAlternative;
Object.defineProperty(exports, "triggerEvent", {
  enumerable: true,
  get: function get() {
    return _deepAssertions.triggerEvent;
  }
});

var _reactRenderHook = _interopRequireDefault(require("react-render-hook"));

var _unexpectedHtmllike = _interopRequireDefault(require("unexpected-htmllike"));

var _unexpectedHtmllikeReactrenderedAdapter = _interopRequireDefault(require("unexpected-htmllike-reactrendered-adapter"));

var _unexpectedHtmllikeJsxAdapter = _interopRequireDefault(require("unexpected-htmllike-jsx-adapter"));

var _unexpectedHtmllikeRawAdapter = _interopRequireDefault(require("unexpected-htmllike-raw-adapter"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = require("react-dom");

var _AssertionGenerator = _interopRequireDefault(require("./AssertionGenerator"));

var _deepAssertions = require("./deepAssertions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function checkAttached(expect) {
  if (!_reactRenderHook["default"].isAttached) {
    expect.errorMode = 'bubble';
    expect.fail(function (output) {
      return output.error('The global rendering hook is not attached').nl().text('This probably means React was required before unexpected-react. Check that unexpected-react is required first');
    });
  }
}

function getOptions(expect) {
  return {
    ActualAdapter: _unexpectedHtmllikeReactrenderedAdapter["default"],
    QueryAdapter: _unexpectedHtmllikeJsxAdapter["default"],
    ExpectedAdapter: _unexpectedHtmllikeRawAdapter["default"],
    actualTypeName: 'RenderedReactElement',
    queryTypeName: 'ReactElement',
    expectedTypeName: 'ReactRawObjectElement',
    getRenderOutput: function getRenderOutput(component) {
      if (component && component.element && component.data && component.data.type && component.data.nodeType) {
        // The component is already the data node
        // This can happen when mixing events and queried for
        return component;
      }

      checkAttached(expect);
      return _reactRenderHook["default"].findComponent(component);
    },
    actualRenderOutputType: 'RenderedReactElementData',
    getDiffInputFromRenderOutput: function getDiffInputFromRenderOutput(renderOutput) {
      return renderOutput;
    },
    rewrapResult: function rewrapResult(renderer, target) {
      return target;
    },
    wrapResultForReturn: function wrapResultForReturn(component, target) {
      return target && target.element.getPublicInstance() || component;
    },
    triggerEvent: _deepAssertions.triggerEvent.bind(null, expect),
    canTriggerEventsOnOutputType: true
  };
}

function installInto(expect) {
  var assertionGenerator = new _AssertionGenerator["default"](getOptions(expect));
  assertionGenerator.installInto(expect);
  expect.addAssertion('<ReactModule> to have been injected', function (expect) {
    checkAttached(expect);
  });
  return assertionGenerator;
}

function installAsAlternative(expect, mainAssertionGenerator) {
  var generatorOptions = getOptions(expect);
  var assertionGenerator = new _AssertionGenerator["default"](_objectSpread({
    mainAssertionGenerator: mainAssertionGenerator
  }, generatorOptions));
  assertionGenerator.installAlternativeExpected(expect);
}