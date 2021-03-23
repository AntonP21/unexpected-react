"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var EmulateDom = require('../helpers/emulateDom');

var Unexpected = require('unexpected');

var UnexpectedReact = require('../../unexpected-react');

var React = require('react');

var PropTypes = require('prop-types');

var TestUtils = require('react-dom/test-utils');

var expect = Unexpected.clone().use(UnexpectedReact);
expect.output.preferredWidth = 80;
/**
 * This is a regression test for bruderstein/unexpected-react#9
 * Unit tests for the issue added in unexpected-htmllike
 */

var LiElement = /*#__PURE__*/function (_React$Component) {
  _inherits(LiElement, _React$Component);

  var _super = _createSuper(LiElement);

  function LiElement() {
    _classCallCheck(this, LiElement);

    return _super.apply(this, arguments);
  }

  _createClass(LiElement, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("li", null, this.props.name);
    }
  }]);

  return LiElement;
}(React.Component);

LiElement.propTypes = {
  name: PropTypes.string
};

var UlElement = /*#__PURE__*/function (_React$Component2) {
  _inherits(UlElement, _React$Component2);

  var _super2 = _createSuper(UlElement);

  function UlElement() {
    _classCallCheck(this, UlElement);

    return _super2.apply(this, arguments);
  }

  _createClass(UlElement, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("ul", null, this.props.items.map(function (i) {
        return /*#__PURE__*/React.createElement(LiElement, {
          key: i.id,
          name: i.name
        });
      }));
    }
  }]);

  return UlElement;
}(React.Component);

UlElement.propTypes = {
  items: PropTypes.array
};
describe('Test', function () {
  var items = [{
    id: 0,
    name: 'Banana'
  }, {
    id: 1,
    name: 'Chocolate'
  }, {
    id: 2,
    name: 'Mustard'
  }];
  it('should render liElement', function () {
    var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(UlElement, {
      items: items
    }));
    return expect(function () {
      return expect(component, 'to have rendered with all children', /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, items[0].name), /*#__PURE__*/React.createElement("li", null, items[2].name), /*#__PURE__*/React.createElement("li", null, items[1].name)));
    }, 'to error', 'expected\n' + '<UlElement items={[\n' + "  { id: 0, name: 'Banana' },\n" + "  { id: 1, name: 'Chocolate' },\n" + "  { id: 2, name: 'Mustard' }\n" + ']}>\n' + '  <ul>\n' + '    <LiElement name="Banana"><li>Banana</li></LiElement>\n' + '    <LiElement name="Chocolate"><li>Chocolate</li></LiElement>\n' + '    <LiElement name="Mustard"><li>Mustard</li></LiElement>\n' + '  </ul>\n' + '</UlElement>\n' + 'to have rendered with all children <ul><li>Banana</li><li>Mustard</li><li>Chocolate</li></ul>\n' + '\n' + '<UlElement items={[\n' + "  { id: 0, name: 'Banana' },\n" + "  { id: 1, name: 'Chocolate' },\n" + "  { id: 2, name: 'Mustard' }\n" + ']}>\n' + '  <ul>\n' + '    <LiElement name="Banana">\n' + '      <li>Banana</li>\n' + '    </LiElement>\n' + '    <LiElement name="Chocolate">\n' + '      <li>\n' + '        Chocolate // -Chocolate\n' + '                  // +Mustard\n' + '      </li>\n' + '    </LiElement>\n' + '    <LiElement name="Mustard">\n' + '      <li>\n' + '        Mustard // -Mustard\n' + '                // +Chocolate\n' + '      </li>\n' + '    </LiElement>\n' + '  </ul>\n' + '</UlElement>');
  });
});