"use strict";

var EmulateDom = require('../helpers/emulateDom');

var Unexpected = require('unexpected');

var UnexpectedReact = require('../../unexpected-react');

var React = require('react');

var _require = require('react-test-renderer/shallow'),
    createRenderer = _require.createRenderer;

var Immutable = require('immutable');

var expect = Unexpected.clone().use(UnexpectedReact);

function ListEntry(props) {
  return /*#__PURE__*/React.createElement("p", null, props.name);
}

function List(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "List"), props.list.map(function (listItem) {
    return /*#__PURE__*/React.createElement(ListEntry, {
      name: listItem,
      key: listItem
    });
  }));
}

describe('issue 28 - immutable components in shallow renderer', function () {
  it('renders the immutable mapped components', function () {
    var renderer = createRenderer();
    var immutableList = Immutable.fromJS(['test1', 'test2']);
    renderer.render( /*#__PURE__*/React.createElement(List, {
      list: immutableList
    }));
    expect(renderer, 'to have rendered', /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "List"), /*#__PURE__*/React.createElement(ListEntry, {
      key: "test1",
      name: "test1"
    }), /*#__PURE__*/React.createElement(ListEntry, {
      key: "test2",
      name: "test2"
    })));
  });
});