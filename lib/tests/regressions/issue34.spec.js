"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _unexpectedReact = _interopRequireDefault(require("../../unexpected-react"));

var _react = _interopRequireWildcard(require("react"));

var _shallow = require("react-test-renderer/shallow");

var _unexpected = _interopRequireDefault(require("unexpected"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

var Foo = /*#__PURE__*/function (_Component) {
  _inherits(Foo, _Component);

  var _super = _createSuper(Foo);

  function Foo(props) {
    var _this;

    _classCallCheck(this, Foo);

    _this = _super.call(this, props);
    _this.state = {
      focus: false
    };
    _this.handleFocus = _this.handleFocus.bind(_assertThisInitialized(_this));
    _this.handleBlur = _this.handleBlur.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Foo, [{
    key: "handleFocus",
    value: function handleFocus(e) {
      this.setState({
        focus: true
      });
    }
  }, {
    key: "handleBlur",
    value: function handleBlur(e) {
      this.setState({
        focus: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var focus = this.state.focus;
      return /*#__PURE__*/_react["default"].createElement("div", {
        tabIndex: "0",
        onFocus: this.handleFocus,
        onBlur: this.handleBlur
      }, focus && /*#__PURE__*/_react["default"].createElement("div", {
        className: "with-focus"
      }, /*#__PURE__*/_react["default"].createElement("span", null, "with focus")));
    }
  }]);

  return Foo;
}(_react.Component);

var expect = _unexpected["default"].clone().use(_unexpectedReact["default"]);

describe('issue 34', function () {
  var renderer;
  before(function () {
    expect.addAssertion('<ReactShallowRenderer> when focussed <assertion>', function (expect, renderer) {
      var _renderer$getRenderOu = renderer.getRenderOutput(),
          onFocus = _renderer$getRenderOu.props.onFocus;

      onFocus();
      return expect.shift(renderer);
    });
    expect.addAssertion('<ReactShallowRenderer> when blurred <assertion>', function (expect, renderer) {
      var _renderer$getRenderOu2 = renderer.getRenderOutput(),
          onBlur = _renderer$getRenderOu2.props.onBlur;

      onBlur();
      return expect.shift(renderer);
    });
  });
  beforeEach(function () {
    renderer = (0, _shallow.createRenderer)();
  });
  describe('with event', function () {
    it("renders div.with-focus on focus", function () {
      renderer.render( /*#__PURE__*/_react["default"].createElement(Foo, null));
      return expect(renderer, 'with event focus', 'to contain', /*#__PURE__*/_react["default"].createElement("div", {
        className: "with-focus"
      }, /*#__PURE__*/_react["default"].createElement("span", null, "with focus")));
    });
    it("does not render div.with-focus' on blur", function () {
      renderer.render( /*#__PURE__*/_react["default"].createElement(Foo, null));
      return expect(renderer, 'with event focus', 'with event blur', 'not to contain', /*#__PURE__*/_react["default"].createElement("div", {
        className: "with-focus"
      }));
    });
  });
  describe('custom', function () {
    it("renders div.with-focus on focus", function () {
      renderer.render( /*#__PURE__*/_react["default"].createElement(Foo, null));
      return expect(renderer, 'when focussed', 'to contain', /*#__PURE__*/_react["default"].createElement("div", {
        className: "with-focus"
      }, /*#__PURE__*/_react["default"].createElement("span", null, "with focus")));
    });
    it("does not render div.with-focus on blur", function () {
      renderer.render( /*#__PURE__*/_react["default"].createElement(Foo, null));
      return expect(renderer, 'when focussed', 'when blurred', 'not to contain', /*#__PURE__*/_react["default"].createElement("div", {
        className: "with-focus"
      }));
    });
  });
});