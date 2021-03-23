"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTestRendererOutputWrapper = getTestRendererOutputWrapper;
exports.isTestRendererOutputWrapper = isTestRendererOutputWrapper;
exports.getRendererOutputJson = getRendererOutputJson;
exports.rewrapResult = rewrapResult;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var TEST_RENDER_OUTPUT = {
  renderOutput: 'Dummy object value to identify test renderer output JSON'
};

function getTestRendererOutputWrapper(testRenderer) {
  return {
    _isTestRenderOutput: TEST_RENDER_OUTPUT,
    json: testRenderer.toJSON(),
    renderer: testRenderer // We keep the renderer around, so we can reuse the renderer for further events

  };
}

function isTestRendererOutputWrapper(value) {
  return value && _typeof(value) === 'object' && value._isTestRenderOutput === TEST_RENDER_OUTPUT;
}

function getRendererOutputJson(value) {
  return value.json;
}

function rewrapResult(wrapper, newJson) {
  return {
    _isTestRenderOutput: TEST_RENDER_OUTPUT,
    json: newJson,
    renderer: wrapper.renderer
  };
}