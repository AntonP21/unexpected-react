"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _types = _interopRequireDefault(require("./types/types"));

var testRendererAssertions = _interopRequireWildcard(require("./assertions/testRendererAssertions"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

module.exports = {
  name: 'unexpected-react-test-renderer',
  installInto: function installInto(expect) {
    expect.installPlugin(require('magicpen-prism'));

    _types["default"].installInto(expect);

    testRendererAssertions.installInto(expect);
    expect.addAssertion(['<ReactTestRenderer|ReactTestRendererOutput> to match snapshot', '<ReactTestRenderer|ReactTestRendererOutput> to satisfy snapshot'], function (expect) {
      expect.errorMode = 'bubble';
      expect.fail({
        message: function message(output) {
          return output.text('To use the `').error(expect.testDescription).text('` assertion with the test renderer, require unexpected-react as `require(\'unexpected-react/test-renderer-jest\');`');
        }
      });
    });
    expect.addAssertion(['<RawReactTestRendererJson> to match snapshot', '<RawReactTestRendererJson> to satisfy snapshot'], function (expect) {
      expect.errorMode = 'bubble';
      expect.fail({
        message: function message(output) {
          return output.text('To use the `').error(expect.testDescription).text('` assertion with the test renderer, require unexpected-react as `require(\'unexpected-react/test-renderer-jest\');`').nl().i().nl().i().text('Also, don\'t pass the JSON, pass the test renderer directly');
        }
      });
    });
  },
  clearAll: function clearAll() {// No-op. Left in so that tests can easily use either interface
  }
};