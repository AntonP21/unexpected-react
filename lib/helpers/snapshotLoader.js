'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadSnapshot = loadSnapshot;
exports.injectLoader = injectLoader;

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function defaultLoader(snapshotPath) {
  if (_fs["default"].statSync(snapshotPath).isFile()) {
    delete require.cache[snapshotPath];
    return require(snapshotPath);
  }

  return null;
}

var loader = defaultLoader;

function loadSnapshot(snapshotPath) {
  var content;

  try {
    if (_fs["default"].statSync(snapshotPath).isFile()) {
      content = loader(snapshotPath);
    }
  } catch (e) {
    content = null;
  }

  return content;
}

function injectLoader(newLoader) {
  loader = newLoader;
}