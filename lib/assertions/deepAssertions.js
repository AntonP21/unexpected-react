"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installInto = installInto;
exports.triggerEvent = triggerEvent;

var _reactRenderHook = _interopRequireDefault(require("react-render-hook"));

var _unexpectedHtmllike = _interopRequireDefault(require("unexpected-htmllike"));

var _unexpectedHtmllikeReactrenderedAdapter = _interopRequireDefault(require("unexpected-htmllike-reactrendered-adapter"));

var _unexpectedHtmllikeJsxAdapter = _interopRequireDefault(require("unexpected-htmllike-jsx-adapter"));

var _react = _interopRequireDefault(require("react"));

var _testUtils = _interopRequireDefault(require("react-dom/test-utils"));

var _reactDom = require("react-dom");

var _AssertionGenerator = _interopRequireDefault(require("./AssertionGenerator"));

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

function checkAttached(expect) {
  if (!_reactRenderHook["default"].isAttached) {
    expect.errorMode = 'bubble';
    expect.fail(function (output) {
      return output.error('The global rendering hook is not attached').nl().text('This probably means React was required before unexpected-react. Check that unexpected-react is required first');
    });
  }
}

function triggerEvent(expect, component, target, eventName, eventArgs) {
  var componentData;

  if (component && component.data && component.data.type && component.data.nodeType) {
    componentData = component;
  } else {
    componentData = _reactRenderHook["default"].findComponent(component);
  }

  var targetDOM = (0, _reactDom.findDOMNode)(componentData.internalInstance.stateNode);

  if (target) {
    targetDOM = (0, _reactDom.findDOMNode)(target.internalInstance.stateNode);
  }

  if (typeof _testUtils["default"].Simulate[eventName] !== 'function') {
    return expect.fail({
      diff: function diff(output) {
        return output.error('Event ').text("'" + eventName + "'").error(' is not supported by TestUtils.Simulate');
      }
    });
  }

  _testUtils["default"].Simulate[eventName](targetDOM, eventArgs);
}

function installInto(expect) {
  var assertionGenerator = new _AssertionGenerator["default"]({
    ActualAdapter: _unexpectedHtmllikeReactrenderedAdapter["default"],
    QueryAdapter: _unexpectedHtmllikeJsxAdapter["default"],
    ExpectedAdapter: _unexpectedHtmllikeJsxAdapter["default"],
    actualTypeName: 'RenderedReactElement',
    queryTypeName: 'ReactElement',
    expectedTypeName: 'ReactElement',
    getRenderOutput: function getRenderOutput(component) {
      if (component && component.data && component.data.type && component.data.nodeType) {
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
      return target && target.internalInstance.stateNode || component;
    },
    triggerEvent: triggerEvent.bind(null, expect),
    canTriggerEventsOnOutputType: true
  });
  assertionGenerator.installInto(expect);
  expect.addAssertion('<ReactModule> to have been injected', function (expect) {
    checkAttached(expect);
  });

  var StatelessWrapper = /*#__PURE__*/function (_React$Component) {
    _inherits(StatelessWrapper, _React$Component);

    var _super = _createSuper(StatelessWrapper);

    function StatelessWrapper() {
      _classCallCheck(this, StatelessWrapper);

      return _super.apply(this, arguments);
    }

    _createClass(StatelessWrapper, [{
      key: "render",
      value: function render() {
        return this.props.children;
      }
    }]);

    return StatelessWrapper;
  }(_react["default"].Component);

  expect.addAssertion('<ReactElement> when deeply rendered <assertion?>', function (expect, subject) {
    var component;

    if (subject.type && subject.type.prototype && typeof subject.type.prototype.render === 'function') {
      component = _testUtils["default"].renderIntoDocument(subject);
    } else {
      // Stateless component
      component = _testUtils["default"].renderIntoDocument( /*#__PURE__*/_react["default"].createElement(StatelessWrapper, null, subject));
      component = _reactRenderHook["default"].findComponent(component);

      if (component) {
        component = component && component.data.children[0] && _reactRenderHook["default"].findInternalComponent(component.data.children[0]);
      } else {
        expect.errorMode = 'nested';
        expect.fail({
          message: function message(output) {
            return output.error('Cannot find rendered stateless component. Are you sure you passed a real component to `when deeply rendered`');
          }
        });
      }
    }

    return expect.shift(component);
  });
  expect.addAssertion('<ReactElement> to [exactly] deeply render [with all children] [with all wrappers] [with all classes] [with all attributes] as <ReactElement>', function (expect, subject, expected) {
    if (this.flags.exactly) {
      return expect(subject, 'when deeply rendered', 'to have exactly rendered', expected);
    }

    return expect(subject, 'when deeply rendered to have rendered [with all children] [with all wrappers] [with all classes] [with all attributes]', expected);
  });
}