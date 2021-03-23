"use strict";

/*
 * This is a set of "normal" tests for some sample component
 * They are meant to demonstrate the use, but also be a check that everything works
 * in the context of a normal project, how people will/should use it
 *
 * These tests should never break, without breaking other more specific tests somewhere else
 */
var EmulateDom = require('../helpers/emulateDom');

var Unexpected = require('unexpected');

var UnexpectedReact = require('../../unexpected-react');

var React = require('react');

var TestUtils = require('react-dom/test-utils');

var _require = require('react-dom'),
    findDOMNode = _require.findDOMNode;

var Select = require('./../components/Select');

var SelectOption = require('./../components/SelectOption');

var expect = Unexpected.clone().use(UnexpectedReact);
describe('Select', function () {
  var component;
  beforeEach(function () {
    var options = [{
      label: 'one',
      value: 1
    }, {
      label: 'two',
      value: 2
    }, {
      label: 'three',
      value: 3
    }];
    component = TestUtils.renderIntoDocument( /*#__PURE__*/React.createElement(Select, {
      options: options
    }));
  });
  it('should render a div.Select', function () {
    return expect(component, 'to have rendered', /*#__PURE__*/React.createElement("div", {
      className: "Select"
    }));
  });
  it('should not show any options initially', function () {
    return expect(component, 'not to contain', /*#__PURE__*/React.createElement(SelectOption, null));
  });
  it('should show the menu when clicked', function () {
    TestUtils.Simulate.click(findDOMNode(component));
    return expect(component, 'to have rendered', /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SelectOption, null), /*#__PURE__*/React.createElement(SelectOption, null), /*#__PURE__*/React.createElement(SelectOption, null)));
  });
  it('renders the options', function () {
    TestUtils.Simulate.click(findDOMNode(component));
    return expect(component, 'to have rendered', /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("li", null, "one"), /*#__PURE__*/React.createElement("li", null, "two"), /*#__PURE__*/React.createElement("li", null, "three")));
  });
  it('renders a particular option with a matching id', function () {
    TestUtils.Simulate.click(findDOMNode(component));
    return expect(component, 'to contain', /*#__PURE__*/React.createElement("li", {
      id: expect.it('to match', /unique_[0-9]+/)
    }, "two"));
  });
  it('renders a particular option using a regex check', function () {
    // Sometimes this test runs very slowly, I don't know why.
    // Increasing the mocha timeout here to make sure we don't get wobbly results from Travis
    this.timeout(5000);
    TestUtils.Simulate.click(findDOMNode(component));
    return expect(component, 'to contain', /*#__PURE__*/React.createElement("li", null, expect.it('to match', /th/)));
  });
  it('renders with the right class', function () {
    TestUtils.Simulate.click(findDOMNode(component));
    return expect(component, 'to contain', /*#__PURE__*/React.createElement("li", {
      className: "Select__item--unselected"
    }));
  });
});