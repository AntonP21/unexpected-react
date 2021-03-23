"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

/*
 * A note about these tests:
 *
 * These tests are specifically only testing that the correct calls are being made
  * to unexpected-htmllike, and that the output is correctly returned.
  * They also test the integration with the unexpected-htmllike-rendered-react-adapter
  * There are many, many more cases for specific diffing cases in the tests for
  * `unexpected-htmllike`
 */
var EmulateDom = require('../helpers/emulateDom');

var Unexpected = require('unexpected');

var UnexpectedReact = require('../../unexpected-react');

var React = require('react');

var PropTypes = require('prop-types');

var TestUtils = require('react-dom/test-utils');

var _require = require('react-dom'),
    findDOMNode = _require.findDOMNode;

var expect = Unexpected.clone().use(UnexpectedReact);
expect.output.preferredWidth = 80;

var CustomComp = /*#__PURE__*/function (_React$Component) {
  _inherits(CustomComp, _React$Component);

  var _super = _createSuper(CustomComp);

  function CustomComp() {
    var _this;

    _classCallCheck(this, CustomComp);

    _this = _super.call(this);
    _this.state = {
      clickCount: 0
    };
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(CustomComp, [{
    key: "onClick",
    value: function onClick(event) {
      event.preventDefault(); // Used to check that we get the event properly

      this.setState({
        clickCount: this.state.clickCount + 1
      });
    }
  }, {
    key: "render",
    value: function render() {
      var children = null;

      if (this.props.childCount) {
        children = [];

        for (var i = 1; i <= this.props.childCount; ++i) {
          children.push( /*#__PURE__*/React.createElement("span", {
            key: i,
            className: '' + i
          }, null, i));
        }
      } // If onClick was passed, add it as a prop, otherwise, leave it undefined


      var extraProps = {};

      if (this.props.useEvents) {
        extraProps.onClick = this.onClick;
        extraProps['data-click-count'] = this.state.clickCount;
      }

      return /*#__PURE__*/React.createElement("div", _extends({
        className: this.props.className
      }, extraProps), children);
    }
  }]);

  return CustomComp;
}(React.Component);

CustomComp.propTypes = {
  childCount: PropTypes.number,
  className: PropTypes.string,
  useEvents: PropTypes.bool
};

var WrapperComp = /*#__PURE__*/function (_React$Component2) {
  _inherits(WrapperComp, _React$Component2);

  var _super2 = _createSuper(WrapperComp);

  function WrapperComp() {
    _classCallCheck(this, WrapperComp);

    return _super2.apply(this, arguments);
  }

  _createClass(WrapperComp, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(CustomComp, this.props);
    }
  }]);

  return WrapperComp;
}(React.Component);

var MyDiv = /*#__PURE__*/function (_React$Component3) {
  _inherits(MyDiv, _React$Component3);

  var _super3 = _createSuper(MyDiv);

  function MyDiv() {
    _classCallCheck(this, MyDiv);

    return _super3.apply(this, arguments);
  }

  _createClass(MyDiv, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", this.props, this.props.children);
    }
  }]);

  return MyDiv;
}(React.Component);

MyDiv.propTypes = {
  children: PropTypes.any
}; // Dummy assertion for testing async expect.it

expect.addAssertion('<string> to eventually have value <string>', function (expect, subject, value) {
  return expect.promise(function (resolve, reject) {
    setTimeout(function () {
      if (subject === value) {
        resolve();
      } else {
        try {
          expect.fail('Failed');
        } catch (e) {
          reject(e); // Return the UnexpectedError object
        }
      }
    }, 10);
  });
});
describe('unexpected-react (deep rendering)', function () {
  beforeEach(function () {
    UnexpectedReact.clearAll();
  });
  describe('identify', function () {
    it('identifies a rendered ES6 component', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(MyDiv, {
        className: "foo"
      }));
      expect(component, 'to be a', 'RenderedReactElement');
    });
  });
  describe('ReactModule', function () {
    it('identifies React correctly', function () {
      expect(React, 'to be a', 'ReactModule');
    });
    it('determines that the global hook has been installed', function () {
      expect(React, 'to have been injected');
    });
  });
  describe('inspect', function () {
    it('inspects a rendered native element', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(MyDiv, {
        className: "foo"
      }));
      expect(expect.inspect(component).toString(), 'to equal', '<MyDiv className="foo"><div className="foo" /></MyDiv>');
    });
    it('inspects a rendered native element with a string child', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(MyDiv, {
        className: "foo"
      }, "content"));
      expect(expect.inspect(component).toString(), 'to equal', '<MyDiv className="foo"><div className="foo">content</div></MyDiv>');
    });
    it('inspects a rendered native element with a numeric child', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(MyDiv, {
        className: "foo"
      }, 42));
      expect(expect.inspect(component).toString(), 'to equal', '<MyDiv className="foo"><div className="foo">42</div></MyDiv>');
    });
    it('inspects a rendered element with children', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(MyDiv, {
        className: "foo"
      }, /*#__PURE__*/React.createElement("span", {
        className: "child1"
      })));
      expect(expect.inspect(component).toString(), 'to equal', '<MyDiv className="foo"><div className="foo"><span className="child1" /></div></MyDiv>');
    });
    it('inspects a rendered native element with children and content', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(MyDiv, {
        className: "foo"
      }, /*#__PURE__*/React.createElement("span", {
        className: "child1"
      }, "child content 1"), /*#__PURE__*/React.createElement("span", {
        className: "child2"
      }, "child content 2")));
      expect(expect.inspect(component).toString(), 'to equal', '<MyDiv className="foo">\n' + '  <div className="foo">\n' + '    <span className="child1">child content 1</span>\n' + '    <span className="child2">child content 2</span>\n' + '  </div>\n' + '</MyDiv>');
    });
    it('inspects a rendered custom component', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar"
      }));
      expect(expect.inspect(component).toString(), 'to equal', '<CustomComp className="bar"><div className="bar" /></CustomComp>');
    });
    it('inspects a rendered custom component with a child custom component element', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(WrapperComp, {
        className: "bar"
      }));
      expect(expect.inspect(component).toString(), 'to equal', '<WrapperComp className="bar">\n' + '  <CustomComp className="bar"><div className="bar" /></CustomComp>\n' + '</WrapperComp>');
    });
  });
  describe('to have rendered', function () {
    it('matches a rendered simple component', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar"
      }));
      return expect(component, 'to have rendered', /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "bar"
      })));
    });
    it('matches a rendered deeper component', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(WrapperComp, {
        className: "bar"
      }));
      return expect(component, 'to have rendered', /*#__PURE__*/React.createElement(WrapperComp, {
        className: "bar"
      }, /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "bar"
      }))));
    });
    it('matches an a component with many children', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(WrapperComp, {
        className: "bar",
        childCount: 3
      }));
      return expect(component, 'to have rendered', /*#__PURE__*/React.createElement(WrapperComp, {
        className: "bar",
        childCount: 3
      }, /*#__PURE__*/React.createElement("div", {
        className: "bar"
      }, /*#__PURE__*/React.createElement("span", {
        className: "1"
      }, "1"), /*#__PURE__*/React.createElement("span", {
        className: "2"
      }, "2"), /*#__PURE__*/React.createElement("span", {
        className: "3"
      }, "3"))));
    });
    it('identifies a missing class', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar foo"
      }));
      return expect(function () {
        return expect(component, 'to have rendered', /*#__PURE__*/React.createElement(CustomComp, {
          className: "blah foo bar"
        }));
      }, 'to error', 'expected <CustomComp className="bar foo"><div className="bar foo" /></CustomComp>\n' + 'to have rendered <CustomComp className="blah foo bar" />\n' + '\n' + '<CustomComp className="bar foo" // missing class \'blah\'\n' + '>\n' + '  <div className="bar foo" />\n' + '</CustomComp>');
    });
    it('identifies a wrapper', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(WrapperComp, {
        className: "bar",
        childCount: 3
      }));
      return expect(component, 'to have rendered', /*#__PURE__*/React.createElement(WrapperComp, {
        className: "bar",
        childCount: 3
      }, /*#__PURE__*/React.createElement("span", {
        className: "1"
      }, "1"), /*#__PURE__*/React.createElement("span", {
        className: "2"
      }, "2"), /*#__PURE__*/React.createElement("span", {
        className: "3"
      }, "3")));
    });
    it('updates on change', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar",
        useEvents: true
      }));
      TestUtils.Simulate.click(findDOMNode(component));
      return expect(component, 'to have rendered', /*#__PURE__*/React.createElement("div", {
        className: "bar",
        "data-click-count": 1
      }));
    });
    it('matches an expect.it assertion on a prop', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar"
      }));
      return expect(component, 'to have rendered', /*#__PURE__*/React.createElement("div", {
        className: expect.it('to match', /bar/)
      }));
    });
    it('highlights a difference with an expect.it assertion on a prop', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar"
      }));
      return expect(function () {
        return expect(component, 'to have rendered', /*#__PURE__*/React.createElement("div", {
          className: expect.it('to match', /foo/)
        }));
      }, 'to throw', 'expected <CustomComp className="bar"><div className="bar" /></CustomComp>\n' + 'to have rendered <div className={expect.it(\'to match\', /foo/)} />\n' + '\n' + '<CustomComp className="bar">\n' + '  <div className="bar" // expected \'bar\' to match /foo/\n' + '  />\n' + '</CustomComp>');
    });
    it('highlights a difference with an expect.it assertion on content', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar",
        childCount: 1
      }));
      return expect(function () {
        return expect(component, 'to have rendered', /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, expect.it('to match', /[a-z]/))));
      }, 'to error', 'expected\n' + '<CustomComp className="bar" childCount={1}>\n' + '  <div className="bar"><span className="1">1</span></div>\n' + '</CustomComp>\n' + 'to have rendered <div><span>{expect.it(\'to match\', /[a-z]/)}</span></div>\n' + '\n' + '<CustomComp className="bar" childCount={1}>\n' + '  <div className="bar">\n' + '    <span className="1">\n' + "      1 // expected '1' to match /[a-z]/\n" + '    </span>\n' + '  </div>\n' + '</CustomComp>');
    });
    it('matches an expect.it on JSX content', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar",
        childCount: 2
      }));
      return expect(component, 'to have rendered', /*#__PURE__*/React.createElement(CustomComp, null, expect.it('to contain', /*#__PURE__*/React.createElement("span", {
        className: "1"
      })).and('to contain', /*#__PURE__*/React.createElement("span", {
        className: "2"
      }))));
    });
    it('highlights a difference with an async expect.it on an attribute', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar"
      }));
      return expect(expect(component, 'to have rendered', /*#__PURE__*/React.createElement("div", {
        className: expect.it('to eventually have value', 'foo')
      })), 'to be rejected with', 'expected <CustomComp className="bar"><div className="bar" /></CustomComp>\n' + 'to have rendered <div className={expect.it(\'to eventually have value\', \'foo\')} />\n' + '\n' + '<CustomComp className="bar">\n' + '  <div className="bar" // expected \'bar\' to eventually have value \'foo\'\n' + '  />\n' + '</CustomComp>');
    });
    it('matches a component that renders multiple numbers', function () {
      var NumberComponent = /*#__PURE__*/function (_React$Component4) {
        _inherits(NumberComponent, _React$Component4);

        var _super4 = _createSuper(NumberComponent);

        function NumberComponent() {
          _classCallCheck(this, NumberComponent);

          return _super4.apply(this, arguments);
        }

        _createClass(NumberComponent, [{
          key: "render",
          value: function render() {
            return /*#__PURE__*/React.createElement("div", null, 3, 6);
          }
        }]);

        return NumberComponent;
      }(React.Component);

      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(NumberComponent, null));
      expect(component, 'to have rendered', /*#__PURE__*/React.createElement("div", null, 3, 6));
    });
    it('matches a component that renders single numbers', function () {
      var NumberComponent = /*#__PURE__*/function (_React$Component5) {
        _inherits(NumberComponent, _React$Component5);

        var _super5 = _createSuper(NumberComponent);

        function NumberComponent() {
          _classCallCheck(this, NumberComponent);

          return _super5.apply(this, arguments);
        }

        _createClass(NumberComponent, [{
          key: "render",
          value: function render() {
            return /*#__PURE__*/React.createElement("div", null, 3);
          }
        }]);

        return NumberComponent;
      }(React.Component);

      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(NumberComponent, null));
      expect(component, 'to have rendered', /*#__PURE__*/React.createElement("div", null, "3"));
    });
    it('provides the rendered component as the fulfillment value', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, null));
      return expect(component, 'to have rendered', /*#__PURE__*/React.createElement("div", null)).then(function (rendered) {
        return expect(rendered, 'to be', component);
      });
    });
  });
  describe('contains', function () {
    it('finds a deep nested component', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar",
        childCount: 3
      }));
      return expect(component, 'to contain', /*#__PURE__*/React.createElement(CustomComp, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "2"))));
    });
    it('throws an error with the best match when the element is not found', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar",
        childCount: 3
      }));
      return expect(function () {
        return expect(component, 'to contain', /*#__PURE__*/React.createElement("span", {
          className: "foo"
        }, "2"));
      }, 'to throw', 'expected\n' + '<CustomComp className="bar" childCount={3}>\n' + '  <div className="bar">\n' + '    <span className="1">1</span>\n' + '    <span className="2">2</span>\n' + '    <span className="3">3</span>\n' + '  </div>\n' + '</CustomComp>\n' + 'to contain <span className="foo">2</span>\n' + '\n' + 'the best match was\n' + '<span className="2" // missing class \'foo\'\n' + '>\n' + '  2\n' + '</span>');
    });
    it('throws an error for `not to contain` with the match when the element is found ', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar",
        childCount: 3
      }));
      return expect(function () {
        return expect(component, 'not to contain', /*#__PURE__*/React.createElement("span", {
          className: "2"
        }, "2"));
      }, 'to throw', 'expected\n' + '<CustomComp className="bar" childCount={3}>\n' + '  <div className="bar">\n' + '    <span className="1">1</span>\n' + '    <span className="2">2</span>\n' + '    <span className="3">3</span>\n' + '  </div>\n' + '</CustomComp>\n' + 'not to contain <span className="2">2</span>\n' + '\n' + 'but found the following match\n' + '<span className="2">2</span>');
    });
    it('returns a rejected promise with the best match when the element is not found with an async expect.it', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar",
        childCount: 3
      }));
      return expect(expect(component, 'to contain', /*#__PURE__*/React.createElement("span", {
        className: expect.it('to eventually have value', 'foo')
      }, "2")), 'to be rejected with', 'expected\n' + '<CustomComp className="bar" childCount={3}>\n' + '  <div className="bar">\n' + '    <span className="1">1</span>\n' + '    <span className="2">2</span>\n' + '    <span className="3">3</span>\n' + '  </div>\n' + '</CustomComp>\n' + 'to contain <span className={expect.it(\'to eventually have value\', \'foo\')}>2</span>\n' + '\n' + 'the best match was\n' + '<span className="2" // expected \'2\' to eventually have value \'foo\'\n' + '>\n' + '  2\n' + '</span>');
    });
  });
  describe('queried for', function () {
    it('finds a rendered component', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar",
        childCount: 3
      }));
      return expect(component, 'queried for', /*#__PURE__*/React.createElement("span", {
        className: "2"
      }), 'to have rendered', /*#__PURE__*/React.createElement("span", {
        className: "2"
      }, "2"));
    });
    it('finds a `contains` query', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar",
        childCount: 3
      }));
      return expect(component, 'queried for', /*#__PURE__*/React.createElement("div", {
        className: "bar"
      }), 'to contain', /*#__PURE__*/React.createElement("span", {
        className: "2"
      }, "2"));
    });
    it('errors when the query is not found', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar",
        childCount: 3
      }));
      return expect(function () {
        return expect(component, 'queried for', /*#__PURE__*/React.createElement("div", {
          className: "not-exist"
        }), 'to contain', /*#__PURE__*/React.createElement("span", {
          className: "2"
        }, "2"));
      }, 'to throw', 'expected\n' + '<CustomComp className="bar" childCount={3}>\n' + '  <div className="bar">\n' + '    <span className="1">1</span>\n' + '    <span className="2">2</span>\n' + '    <span className="3">3</span>\n' + '  </div>\n' + '</CustomComp>\n' + 'queried for <div className="not-exist" /> to contain <span className="2">2</span>\n' + '\n' + '`queried for` found no match.  The best match was\n' + '<div className="bar" // missing class \'not-exist\'\n' + '>\n' + '  <span className="1">1</span>\n' + '  <span className="2">2</span>\n' + '  <span className="3">3</span>\n' + '</div>');
    });
    it('errors correctly when the following assertion fails', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar",
        childCount: 3
      }));
      return expect(function () {
        return expect(component, 'queried for', /*#__PURE__*/React.createElement("span", {
          className: "2"
        }), 'to have rendered', /*#__PURE__*/React.createElement("span", {
          className: "2"
        }, "foo"));
      }, 'to throw', 'expected\n' + '<CustomComp className="bar" childCount={3}>\n' + '  <div className="bar">\n' + '    <span className="1">1</span>\n' + '    <span className="2">2</span>\n' + '    <span className="3">3</span>\n' + '  </div>\n' + '</CustomComp>\n' + 'queried for <span className="2" /> to have rendered <span className="2">foo</span>\n' + '\n' + '<span className="2">\n' + '  2 // -2\n' + '    // +foo\n' + '</span>');
    });
    it('finds an element with an async expect.it', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar",
        childCount: 3
      }));
      return expect(component, 'queried for', /*#__PURE__*/React.createElement("div", {
        className: expect.it('to eventually have value', 'bar')
      }), 'to contain', /*#__PURE__*/React.createElement("span", {
        className: "2"
      }, "2"));
    });
    it('passes the located component as the resolution of the promise', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar",
        childCount: 3
      }));
      return expect(component, 'queried for', /*#__PURE__*/React.createElement("span", {
        className: "2"
      })).then(function (span) {
        expect(span, 'to be a', HTMLElement);
        expect(span, 'to satisfy', {
          className: '2'
        });
      });
    });
    it('passes the located component as the resolution of the promise when the query is async', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar",
        childCount: 3
      }));
      return expect(component, 'queried for', /*#__PURE__*/React.createElement("span", {
        className: expect.it('to eventually have value', '2')
      })).then(function (span) {
        expect(span, 'to be a', HTMLElement);
        expect(span, 'to satisfy', {
          className: '2'
        });
      });
    });
    it('uses `queryTarget` as the target element', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(CustomComp, {
        className: "bar",
        childCount: 3
      }));
      return expect(component, 'queried for', /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
        queryTarget: true,
        className: expect.it('to eventually have value', '2')
      }))).then(function (span) {
        expect(span, 'to be a', HTMLElement);
        expect(span, 'to satisfy', {
          className: '2'
        });
      });
    });
  });
  describe('with events', function () {
    var ClickableComponent = /*#__PURE__*/function (_React$Component6) {
      _inherits(ClickableComponent, _React$Component6);

      var _super6 = _createSuper(ClickableComponent);

      function ClickableComponent(props) {
        var _this2;

        _classCallCheck(this, ClickableComponent);

        _this2 = _super6.call(this, props);
        _this2.state = {
          clickCount: 1,
          itemClickCount: 1
        };
        _this2.handleMainClick = _this2.handleMainClick.bind(_assertThisInitialized(_this2));
        _this2.handleMouseDown = _this2.handleMouseDown.bind(_assertThisInitialized(_this2));
        _this2.handleItemClick = _this2.handleItemClick.bind(_assertThisInitialized(_this2));
        _this2.handleItemMouseDown = _this2.handleItemMouseDown.bind(_assertThisInitialized(_this2));
        return _this2;
      }

      _createClass(ClickableComponent, [{
        key: "handleMainClick",
        value: function handleMainClick() {
          this.setState({
            clickCount: this.state.clickCount + 1
          });
        }
      }, {
        key: "handleMouseDown",
        value: function handleMouseDown(e) {
          this.setState({
            clickCount: this.state.clickCount + (e && e.mouseX || 1)
          });
        }
      }, {
        key: "handleItemClick",
        value: function handleItemClick() {
          this.setState({
            itemClickCount: this.state.itemClickCount + 1
          });
        }
      }, {
        key: "handleItemMouseDown",
        value: function handleItemMouseDown(e) {
          this.setState({
            itemClickCount: this.state.itemClickCount + (e && e.mouseX || 1)
          });
        }
      }, {
        key: "render",
        value: function render() {
          return /*#__PURE__*/React.createElement("div", {
            onClick: this.handleMainClick,
            onMouseDown: this.handleMouseDown
          }, /*#__PURE__*/React.createElement("span", {
            className: "main-click"
          }, "Main clicked ", this.state.clickCount), /*#__PURE__*/React.createElement("span", {
            className: "item-click testfoo testbar",
            onClick: this.handleItemClick,
            onMouseDown: this.handleItemMouseDown
          }, "Item clicked ", this.state.itemClickCount || 0));
        }
      }]);

      return ClickableComponent;
    }(React.Component);

    it('renders a zero initially', function () {
      // This test is (was) failing, when the initial click count is 0. Seems to be a bug in the devtools.
      // Not yet tried updating the devtools.
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(ClickableComponent, null));
      expect(component, 'to have rendered', /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
        className: "main-click"
      }, "Main clicked 1"), /*#__PURE__*/React.createElement("span", {
        className: "item-click"
      }, "Item clicked 1")));
    });
    it('calls click on a component using the deep renderer', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(ClickableComponent, null));
      expect(component, 'with event', 'click', 'to have rendered', /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
        className: "main-click"
      }, "Main clicked 2")));
    });
    it('calls click on a sub component using the deep renderer', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(ClickableComponent, null));
      expect(component, 'with event', 'click', 'on', /*#__PURE__*/React.createElement("span", {
        className: "item-click"
      }), 'to have rendered', /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
        className: "item-click"
      }, "Item clicked 2")));
    });
    it('triggers multiple events', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(ClickableComponent, null));
      expect(component, 'with event', 'click', 'on', /*#__PURE__*/React.createElement("span", {
        className: "item-click"
      }), 'with event', 'click', 'on', /*#__PURE__*/React.createElement("span", {
        className: "item-click"
      }), 'to have rendered', /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
        className: "item-click"
      }, "Item clicked 3")));
    });
    it('triggers multiple events with eventArgs', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(ClickableComponent, null));
      expect(component, 'with event', 'mouseDown', {
        mouseX: 2
      }, 'with event', 'mouseDown', {
        mouseX: 4
      }, 'to have rendered', /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
        className: "main-click"
      }, "Main clicked 7")));
    });
    it('calls click on a sub component with `to contain`', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(ClickableComponent, null));
      expect(component, 'with event', 'click', 'on', /*#__PURE__*/React.createElement("span", {
        className: "item-click"
      }), 'to contain', /*#__PURE__*/React.createElement("span", {
        className: "item-click"
      }, "Item clicked 2"));
    });
    it('calls click on a sub component with `not to contain`', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(ClickableComponent, null));
      expect(component, 'with event', 'click', 'on', /*#__PURE__*/React.createElement("span", {
        className: "item-click"
      }), 'not to contain', /*#__PURE__*/React.createElement("span", {
        className: "item-click"
      }, "Item clicked 1"));
    });
    it('calls click on a sub component with `not to contain with all children`', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(ClickableComponent, null));
      expect(component, 'with event', 'click', 'on', /*#__PURE__*/React.createElement("span", {
        className: "item-click"
      }), 'not to contain with all children', /*#__PURE__*/React.createElement("span", {
        className: "item-click"
      }, "Item clicked 1"));
    });
    it('ignores extra classes by default in the `on` clause', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(ClickableComponent, null));
      expect(component, 'with event', 'click', 'on', /*#__PURE__*/React.createElement("span", {
        className: "item-click testfoo"
      }), 'to contain', /*#__PURE__*/React.createElement("span", {
        className: "item-click"
      }, "Item clicked 2"));
    });
    it('calls click on a sub component with `queried for`', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(ClickableComponent, null));
      expect(component, 'with event', 'click', 'on', /*#__PURE__*/React.createElement("span", {
        className: "item-click"
      }), 'queried for', /*#__PURE__*/React.createElement("span", {
        className: "item-click"
      }), 'to have rendered', /*#__PURE__*/React.createElement("span", {
        className: "item-click"
      }, "Item clicked 2"));
    });
    it('fails with a helpful error when the event is not known', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(ClickableComponent, null));
      expect(function () {
        return expect(component, 'with event', 'foo', 'to have rendered', /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
          className: "main-click"
        }, "Main clicked 2")));
      }, 'to throw', /Event 'foo' is not supported by TestUtils.Simulate/);
    });
    it('calls events with event parameters', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(ClickableComponent, null));
      expect(component, 'with event', 'mouseDown', {
        mouseX: 50
      }, 'to have rendered', /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
        className: "main-click"
      }, "Main clicked 51")));
    });
    it('fails with a helpful error message when the target cannot be found', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(ClickableComponent, null));
      expect(function () {
        return expect(component, 'with event', 'click', 'on', /*#__PURE__*/React.createElement("span", {
          className: "not exists"
        }), 'to have rendered', /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "This is never checked")));
      }, 'to throw', /Could not find the target for the event. The best match was/);
    });
    it('passes the resulting component as the resolution of the promise', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(ClickableComponent, null));
      return expect(component, 'with event', 'click').then(function (result) {
        expect(result.state, 'to satisfy', {
          clickCount: 2
        });
      });
    });
    it('passes the resulting component as the resolution of the promise with an event argument', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(ClickableComponent, null));
      return expect(component, 'with event', 'mouseDown', {
        mouseX: 10
      }).then(function (result) {
        expect(result.state, 'to satisfy', {
          clickCount: 11
        });
      });
    });
    it('passes the resulting component as the resolution of the promise when using `on`', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(ClickableComponent, null));
      return expect(component, 'with event', 'click', 'on', /*#__PURE__*/React.createElement("span", {
        className: "item-click"
      })).then(function (result) {
        expect(result.state, 'to satisfy', {
          itemClickCount: 2
        });
      });
    });
    it('passes the resulting component as the resolution of the promise when using event arguments and `on`', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(ClickableComponent, null));
      return expect(component, 'with event', 'mouseDown', {
        mouseX: 10
      }, 'on', /*#__PURE__*/React.createElement("span", {
        className: "item-click"
      })).then(function (result) {
        expect(result.state, 'to satisfy', {
          itemClickCount: 11
        });
      });
    });
    it('passes the resulting component as the resolution of the promise with multiple events', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(ClickableComponent, null));
      return expect(component, 'with event', 'mouseDown', {
        mouseX: 10
      }, 'on', /*#__PURE__*/React.createElement("span", {
        className: "item-click"
      }), 'and with event', 'click').then(function (result) {
        expect(result.state, 'to satisfy', {
          clickCount: 12,
          itemClickCount: 11
        });
      });
    });
    it('passes the resulting component as the resolution of the promise with multiple events and eventArgs', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(ClickableComponent, null));
      return expect(component, 'with event', 'mouseDown', {
        mouseX: 10
      }, 'on', /*#__PURE__*/React.createElement("span", {
        className: "item-click"
      }), 'and with event', 'mouseDown', {
        mouseX: 15
      }).then(function (result) {
        expect(result.state, 'to satisfy', {
          clickCount: 26,
          itemClickCount: 11
        });
      });
    });
    it('uses the `eventTarget` prop to identify the target for the event', function () {
      var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(ClickableComponent, null));
      return expect(component, 'with event', 'mouseDown', {
        mouseX: 10
      }, 'on', /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
        className: "item-click",
        eventTarget: true
      }))).then(function (result) {
        expect(result.state, 'to satisfy', {
          clickCount: 11,
          itemClickCount: 11
        });
      });
    });
    describe('combined with queried for', function () {
      var TodoItem = /*#__PURE__*/function (_React$Component7) {
        _inherits(TodoItem, _React$Component7);

        var _super7 = _createSuper(TodoItem);

        function TodoItem() {
          var _this3;

          _classCallCheck(this, TodoItem);

          _this3 = _super7.call(this);
          _this3.state = {
            isCompleted: 'false'
          };
          _this3.onClick = _this3.onClick.bind(_assertThisInitialized(_this3));
          return _this3;
        }

        _createClass(TodoItem, [{
          key: "onClick",
          value: function onClick() {
            this.setState({
              isCompleted: 'true'
            });
          }
        }, {
          key: "render",
          value: function render() {
            return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, this.props.label), /*#__PURE__*/React.createElement("span", null, "Is complete ", this.state.isCompleted), /*#__PURE__*/React.createElement("button", {
              onClick: this.onClick
            }, "Click me"));
          }
        }]);

        return TodoItem;
      }(React.Component); // This is a class so we can use renderIntoDocument (and don't need to rely on `when rendered`)


      var TodoList = /*#__PURE__*/function (_React$Component8) {
        _inherits(TodoList, _React$Component8);

        var _super8 = _createSuper(TodoList);

        function TodoList() {
          _classCallCheck(this, TodoList);

          return _super8.apply(this, arguments);
        }

        _createClass(TodoList, [{
          key: "render",
          value: function render() {
            return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TodoItem, {
              id: 1,
              label: "one"
            }), /*#__PURE__*/React.createElement(TodoItem, {
              id: 2,
              label: "two"
            }), /*#__PURE__*/React.createElement(TodoItem, {
              id: 3,
              label: "three"
            }));
          }
        }]);

        return TodoList;
      }(React.Component);

      it('combines with queried for', function () {
        var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(TodoList, null));
        expect(component, 'queried for', /*#__PURE__*/React.createElement(TodoItem, {
          id: 2
        }), 'with event', 'click', 'on', /*#__PURE__*/React.createElement("button", null), 'to have rendered', /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "two"), /*#__PURE__*/React.createElement("span", null, "Is complete true")));
      });
      it('combines with queried for using the result promise', function () {
        var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(TodoList, null));
        return expect(component, 'queried for', /*#__PURE__*/React.createElement(TodoItem, {
          id: 2
        })).then(function (todoItem) {
          return expect(todoItem, 'with event', 'click', 'on', /*#__PURE__*/React.createElement("button", null), 'to have rendered', /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "two"), /*#__PURE__*/React.createElement("span", null, "Is complete true")));
        });
      });
      it('combines with queried for using the result promise and the event promise', function () {
        var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(TodoList, null));
        return expect(component, 'queried for', /*#__PURE__*/React.createElement(TodoItem, {
          id: 2
        })).then(function (todoItem) {
          return expect(todoItem, 'with event', 'click', 'on', /*#__PURE__*/React.createElement("button", null));
        }).then(function (todoItem) {
          return expect(todoItem, 'to have rendered', /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "two"), /*#__PURE__*/React.createElement("span", null, "Is complete true")));
        });
      });
      it('with event followed by queried for returns correct element', function () {
        var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(TodoList, null));
        return expect(component, 'with event click', 'on', /*#__PURE__*/React.createElement(TodoItem, {
          id: 2
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
          eventTarget: true
        }))), 'queried for', /*#__PURE__*/React.createElement(TodoItem, {
          id: 2
        })).then(function (todoItem) {
          expect(todoItem.state, 'to satisfy', {
            isCompleted: 'true'
          });
        });
      });
      it('with multiple events followed by queried for returns correct element', function () {
        var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(TodoList, null));
        return expect(component, 'with event click', 'on', /*#__PURE__*/React.createElement(TodoItem, {
          id: 2
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
          eventTarget: true
        }))), 'with event click', 'on', /*#__PURE__*/React.createElement(TodoItem, {
          id: 1
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
          eventTarget: true
        }))), 'queried for', /*#__PURE__*/React.createElement(TodoItem, {
          id: 2
        })).then(function (todoItem) {
          expect(todoItem.state, 'to satisfy', {
            isCompleted: 'true'
          });
        });
      });
      it('with multiple events followed by queried for for a HTML element returns correct element', function () {
        var component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(TodoList, null));
        return expect(component, 'with event', 'click', {}, 'with event', 'click', {}, 'with event', 'click', {}, 'queried for', /*#__PURE__*/React.createElement(TodoItem, {
          id: 2
        }, /*#__PURE__*/React.createElement("div", {
          queryTarget: true
        }))).then(function (div) {
          expect(div, 'to be a', HTMLElement);
          expect(div, 'to satisfy', {
            tagName: 'DIV'
          });
        });
      });
    });
  });
  describe('when deeply rendered', function () {
    var Stateless = function Stateless(props) {
      return /*#__PURE__*/React.createElement("div", {
        className: "stateless-ftw"
      }, "Yay");
    };

    it('renders a class component', function () {
      expect( /*#__PURE__*/React.createElement(CustomComp, {
        className: "foo"
      }), 'when deeply rendered', 'to have rendered', /*#__PURE__*/React.createElement("div", {
        className: "foo"
      }));
    });
    it('renders a stateless component', function () {
      expect( /*#__PURE__*/React.createElement(Stateless, null), 'when deeply rendered', 'to have exactly rendered', /*#__PURE__*/React.createElement(Stateless, null, /*#__PURE__*/React.createElement("div", {
        className: "stateless-ftw"
      }, "Yay")));
    });
    it('errors when a stateless component render does not match', function () {
      expect(function () {
        return expect( /*#__PURE__*/React.createElement(Stateless, null), 'when deeply rendered', 'to have exactly rendered', /*#__PURE__*/React.createElement(Stateless, null, /*#__PURE__*/React.createElement("div", {
          className: "stateless-broken"
        }, "Yay")));
      }, 'to throw', ['expected <Stateless />', 'when deeply rendered to have exactly rendered <Stateless><div className="stateless-broken">Yay</div></Stateless>', '', '<Stateless>', '  <div', '     className="stateless-ftw" // expected \'stateless-ftw\' to equal \'stateless-broken\'', '                               //', '                               // -stateless-ftw', '                               // +stateless-broken', '  >', '    Yay', '  </div>', '</Stateless>'].join('\n'));
    });
  });
  describe('to deeply render as', function () {
    var Stateless = function Stateless(props) {
      return /*#__PURE__*/React.createElement("div", {
        className: "stateless-ftw"
      }, "Yay");
    };

    it('renders a class component', function () {
      expect( /*#__PURE__*/React.createElement(CustomComp, {
        className: "foo"
      }), 'to deeply render as', /*#__PURE__*/React.createElement("div", {
        className: "foo"
      }));
    });
    it('renders a stateless component', function () {
      expect( /*#__PURE__*/React.createElement(Stateless, null), 'to deeply render as', /*#__PURE__*/React.createElement(Stateless, null, /*#__PURE__*/React.createElement("div", {
        className: "stateless-ftw"
      }, "Yay")));
    });
    it('errors when a stateless component render does not match', function () {
      expect(function () {
        return expect( /*#__PURE__*/React.createElement(Stateless, null), 'to deeply render as', /*#__PURE__*/React.createElement(Stateless, null, /*#__PURE__*/React.createElement("div", {
          className: "stateless-broken"
        }, "Yay")));
      }, 'to throw', ['expected <Stateless />', 'to deeply render as <Stateless><div className="stateless-broken">Yay</div></Stateless>', '', '<Stateless>', '  <div className="stateless-ftw" // missing class \'stateless-broken\'', '  >', '    Yay', '  </div>', '</Stateless>'].join('\n'));
    });
    it('renders using the exactly flag', function () {
      expect( /*#__PURE__*/React.createElement(CustomComp, {
        className: "foo"
      }), 'to exactly deeply render as', /*#__PURE__*/React.createElement(CustomComp, {
        className: "foo"
      }, /*#__PURE__*/React.createElement("div", {
        className: "foo"
      })));
    });
    it('outputs the error when using the exactly flag', function () {
      expect(function () {
        return expect( /*#__PURE__*/React.createElement(CustomComp, {
          className: "foo"
        }), 'to exactly deeply render as', /*#__PURE__*/React.createElement(CustomComp, {
          className: "foo"
        }, /*#__PURE__*/React.createElement("div", {
          className: "foo bar"
        })));
      }, 'to throw', ['expected <CustomComp className="foo" />', 'to exactly deeply render as <CustomComp className="foo"><div className="foo bar" /></CustomComp>', '', '<CustomComp className="foo">', '  <div className="foo" // expected \'foo\' to equal \'foo bar\'', '                       //', '                       // -foo', '                       // +foo bar', '  />', '</CustomComp>'].join('\n'));
    });
    it('outputs the error when using the with all classes flag', function () {
      expect(function () {
        return expect( /*#__PURE__*/React.createElement(CustomComp, {
          className: "foo"
        }), 'to deeply render with all classes as', /*#__PURE__*/React.createElement(CustomComp, {
          className: "foo"
        }, /*#__PURE__*/React.createElement("div", {
          className: "foo bar"
        })));
      }, 'to throw', ['expected <CustomComp className="foo" />', 'to deeply render with all classes as <CustomComp className="foo"><div className="foo bar" /></CustomComp>', '', '<CustomComp className="foo">', '  <div className="foo" // missing class \'bar\'', '  />', '</CustomComp>'].join('\n'));
    });
    it('provides the rendered component as the fulfillment value', function () {
      return expect( /*#__PURE__*/React.createElement(CustomComp, null), 'to deeply render as', /*#__PURE__*/React.createElement(CustomComp, null)).then(function (customComp) {
        return expect(customComp, 'to be a', 'RenderedReactElement');
      });
    });
  });
  describe('with component returning array', function () {
    it('passes with a correct render', function () {
      var TestArray = /*#__PURE__*/function (_React$Component9) {
        _inherits(TestArray, _React$Component9);

        var _super9 = _createSuper(TestArray);

        function TestArray() {
          _classCallCheck(this, TestArray);

          return _super9.apply(this, arguments);
        }

        _createClass(TestArray, [{
          key: "render",
          value: function render() {
            return [/*#__PURE__*/React.createElement("div", null, "one"), /*#__PURE__*/React.createElement("div", null, "two")];
          }
        }]);

        return TestArray;
      }(React.Component);

      expect( /*#__PURE__*/React.createElement(TestArray, null), 'to deeply render as', /*#__PURE__*/React.createElement(TestArray, null, /*#__PURE__*/React.createElement("div", null, "one"), /*#__PURE__*/React.createElement("div", null, "two")));
    });
    it('renders the diff when one element fails', function () {
      var TestArray = /*#__PURE__*/function (_React$Component10) {
        _inherits(TestArray, _React$Component10);

        var _super10 = _createSuper(TestArray);

        function TestArray() {
          _classCallCheck(this, TestArray);

          return _super10.apply(this, arguments);
        }

        _createClass(TestArray, [{
          key: "render",
          value: function render() {
            return [/*#__PURE__*/React.createElement("div", null, "one"), /*#__PURE__*/React.createElement("div", null, "two")];
          }
        }]);

        return TestArray;
      }(React.Component);

      expect(function () {
        return expect( /*#__PURE__*/React.createElement(TestArray, null), 'to deeply render as', /*#__PURE__*/React.createElement(TestArray, null, /*#__PURE__*/React.createElement("div", null, "one"), /*#__PURE__*/React.createElement("div", null, "three")));
      }, 'to throw', ['expected <TestArray />', 'to deeply render as <TestArray><div>one</div><div>three</div></TestArray>', '', '<TestArray>', '  <div>one</div>', '  <div>', '    two // -two', '        // +three', '  </div>', '</TestArray>'].join('\n'));
    });
  });
  describe('with React.Fragments', function () {
    var TestComponent = /*#__PURE__*/function (_React$Component11) {
      _inherits(TestComponent, _React$Component11);

      var _super11 = _createSuper(TestComponent);

      function TestComponent() {
        _classCallCheck(this, TestComponent);

        return _super11.apply(this, arguments);
      }

      _createClass(TestComponent, [{
        key: "render",
        value: function render() {
          var children = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("li", null, "one"), /*#__PURE__*/React.createElement("li", null, "two"));

          if (this.props.includeEnd) {
            children = [children, /*#__PURE__*/React.createElement("li", null, "End")];
          }

          return /*#__PURE__*/React.createElement("ol", null, children);
        }
      }]);

      return TestComponent;
    }(React.Component);

    it('flattens the fragment', function () {
      expect( /*#__PURE__*/React.createElement(TestComponent, null), 'to deeply render as', /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, "one"), /*#__PURE__*/React.createElement("li", null, "two")));
    });
    it('flattens the fragment with other children', function () {
      expect( /*#__PURE__*/React.createElement(TestComponent, {
        includeEnd: true
      }), 'to deeply render as', /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, "one"), /*#__PURE__*/React.createElement("li", null, "two"), /*#__PURE__*/React.createElement("li", null, "End")));
    });
  });
});