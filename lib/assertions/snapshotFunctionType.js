"use strict";

var _snapshots = require("../helpers/snapshots");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function installInto(expect) {
  expect.addType({
    name: 'jest-snapshot-function',
    base: 'object',
    identify: function identify(value) {
      return value && _typeof(value) === 'object' && value.$functype === _snapshots.FUNCTION_ID;
    },
    inspect: function inspect(value, depth, output) {
      return output.clone().text('function ').cyan(value.name).text('(').text(value.args).text(') { /* function body */ }');
    }
  });
}

module.exports = {
  installInto: installInto
};