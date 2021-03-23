"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _types = _interopRequireDefault(require("./types/types"));

var testRendererAssertions = _interopRequireWildcard(require("./assertions/testRendererAssertions"));

var testRendererAgainstRawAssertions = _interopRequireWildcard(require("./assertions/testRendererAgainstRawAssertions"));

var jestSnapshotAssertions = _interopRequireWildcard(require("./assertions/jestSnapshotTestRendererAssertions"));

var snapshotFunctionType = _interopRequireWildcard(require("./assertions/snapshotFunctionType"));

var snapshotFunctionAssertions = _interopRequireWildcard(require("./assertions/snapshotFunctionAssertions"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

module.exports = {
  name: 'unexpected-react-test-renderer',
  installInto: function installInto(expect) {
    expect.installPlugin(require('magicpen-prism'));

    _types["default"].installInto(expect); // This is a bit of a hack. The AssertionGenerator generates a type for context to add the pending event,
    // and this type must be re-used when adding further assertions with a different expected type
    // - in this case that's the RawAdapter type rather than the ReactElement type.
    // It works, but it's ugly.  It would be nicer to split the AssertionGenerator out further
    // such that this could be less ugly - not sure how that would look though.
    // This /may/ be solved by the upcoming (possibly already existing!) expect.context interface.
    // When that's available, we won't need the intermediate type for pending events, and we can just
    // add the pending event to the context and have the main assertions handle it.
    // But we can't rely on that yet, I don't think


    var mainAssertionGenerator = testRendererAssertions.installInto(expect);
    testRendererAgainstRawAssertions.installAsAlternative(expect, mainAssertionGenerator);
    jestSnapshotAssertions.installInto(expect);
    snapshotFunctionType.installInto(expect);
    snapshotFunctionAssertions.installInto(expect);
    expect.addAssertion('<RawReactTestRendererJson> to match snapshot', function (expect, subject) {
      expect.errorMode = 'bubble';
      expect.fail({
        message: function message(output) {
          return output.text('To assert snapshots, use the testRenderer directly, not the result of `.toJSON()`').nl().i().text('e.g.').nl().i().text('  const testRenderer = ReactTestRenderer.create(<MyComponent />);').nl().i().text('  expect(testRenderer, \'to match snapshot\');');
        }
      });
    });
  },
  clearAll: function clearAll() {// No-op. Left in so that tests can easily use either interface
  }
};