"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compareSnapshot = compareSnapshot;
exports.injectStateHooks = injectStateHooks;
exports.getFunctionArgs = getFunctionArgs;
exports.writerOptions = exports.FUNCTION_ID = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _jsWriter = _interopRequireDefault(require("js-writer"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _path = _interopRequireDefault(require("path"));

var _react = _interopRequireDefault(require("react"));

var _unexpectedHtmllikeRawAdapter = _interopRequireDefault(require("unexpected-htmllike-raw-adapter"));

var _snapshotLoader = require("./snapshotLoader");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var matchers;

try {
  matchers = require('jest-matchers');

  if (!matchers || typeof matchers.getState !== 'function') {
    throw new Error();
  }
} catch (e) {
  matchers = require('expect');
} // Serializable "unique" ID


var FUNCTION_ID = "$FUNC$bc*(!CDKRRz195123$";
exports.FUNCTION_ID = FUNCTION_ID;
var FUNC_ARGS_REGEX = /function [^(]*\(([^)]*)\)/;

function getFunctionArgs(func) {
  var match = FUNC_ARGS_REGEX.exec(func.toString());

  if (match) {
    return match[1].split(',').map(function (arg) {
      return arg.trim();
    }).join(', ');
  }

  return '';
}

var writerOptions = {
  handlers: {
    'function': function _function(func) {
      var functionDefinition = {
        $functype: FUNCTION_ID,
        name: func.name || '',
        args: getFunctionArgs(func)
      };
      return JSON.stringify(functionDefinition);
    }
  }
};
exports.writerOptions = writerOptions;

var UnexpectedSnapshotState = /*#__PURE__*/function () {
  function UnexpectedSnapshotState(snapshotState) {
    _classCallCheck(this, UnexpectedSnapshotState);

    var files = {};
    this._files = files;
  }

  _createClass(UnexpectedSnapshotState, [{
    key: "getSnapshot",
    value: function getSnapshot(testPath, testName, expect, snapshotState) {
      var snapshot = this._files[testPath];

      if (!snapshot) {
        var snapshotPath = getSnapshotPath(testPath);
        var content = (0, _snapshotLoader.loadSnapshot)(snapshotPath);
        var contentOutput = {};

        if (content) {
          Object.keys(content).reduce(function (agg, testKey) {
            agg[testKey] = expect.output.clone().annotationBlock(function () {
              this.append(expect.inspect(rawAdapter.deserialize(content[testKey])));
            }).toString();
            return agg;
          }, contentOutput);
        }

        snapshot = this._files[testPath] = {
          testCounter: {},
          uncheckedKeys: content && new Set(Object.keys(content)) || new Set(),
          allTests: content || {},
          contentOutput: contentOutput,
          failedTests: new Set()
        };
      }

      var count = (snapshot.testCounter[testName] || 0) + 1;
      snapshot.testCounter[testName] = count;
      var keyName = testName + ' ' + count;
      snapshot.uncheckedKeys["delete"](keyName);
      return snapshot.allTests[keyName] || null;
    }
  }, {
    key: "saveSnapshot",
    value: function saveSnapshot(testPath, testName, tree, expect) {
      var snapshotPath = getSnapshotPath(testPath);
      var snapshot = this._files[testPath]; // If we've been passed a new tree, update the current snapshot
      // Otherwise, we're just saving the file

      if (tree) {
        var count = snapshot.testCounter[testName] || 1;
        snapshot.allTests[testName + ' ' + count] = tree;
        snapshot.contentOutput[testName + ' ' + count] = expect.output.clone().annotationBlock(function () {
          this.append(expect.inspect(tree));
        }).toString();
      }

      var dir = _path["default"].dirname(snapshotPath);

      var exists;

      try {
        exists = _fs["default"].statSync(dir).isDirectory();
      } catch (e) {
        exists = false;
      }

      if (!exists) {
        try {
          _mkdirp["default"].sync(dir);
        } catch (e) {// ignore, it may have been created in a separate test
        }
      }

      var fileContent = Object.keys(snapshot.allTests).map(function (test) {
        var display = snapshot.contentOutput[test] || '// Display unavailable (this is probably a bug in unexpected-react, please report it!)';
        return "/////////////////// ".concat(test, " ///////////////////\n\n").concat(display, "\n\nexports[`").concat(test, "`] = ").concat((0, _jsWriter["default"])(snapshot.allTests[test], writerOptions), ";\n// ===========================================================================\n");
      }).join('\n\n');

      _fs["default"].writeFileSync(snapshotPath, fileContent);
    }
  }, {
    key: "markTestAsFailed",
    value: function markTestAsFailed(testPath, testName) {
      var snapshot = this._files[testPath];
      snapshot.failedTests.add(testName);
    }
  }]);

  return UnexpectedSnapshotState;
}();

function getSnapshotPath(testPath) {
  var testPathParsed = _path["default"].parse(testPath);

  testPathParsed.dir = _path["default"].join(testPathParsed.dir, '__snapshots__');
  testPathParsed.base = testPathParsed.name + '.unexpected-snap';
  return _path["default"].format(testPathParsed);
}

var rawAdapter = new _unexpectedHtmllikeRawAdapter["default"]({
  convertToString: true,
  concatTextContent: true
});

function compareSnapshot(expect, flags, subjectAdapter, subjectRenderer, subjectOutput) {
  var state = matchers.getState();

  if (!state.unexpectedSnapshot) {
    state.unexpectedSnapshot = new UnexpectedSnapshotState(state.snapshotState);
  }

  var snapshot = state.unexpectedSnapshot.getSnapshot(state.testPath, state.currentTestName, expect, state.snapshotState); // For jest <= 19, snapshotState.update is true when updating
  // for >= 20, snapshotState._updateSnapshot is 'all' when `-u` is specified
  //                                             'new' when nothing is specified,
  //                                             'none' when `--ci` is specified
  // Jest <= 19 always updated new snapshots, so if _updateSnapshot is undefined, we're assuming an older version,
  // and hence can always update the new snapshot

  if (snapshot === null) {
    var updateSnapshot = state.snapshotState._updateSnapshot;

    if (updateSnapshot === 'new' || updateSnapshot === 'all' || updateSnapshot === undefined) {
      state.unexpectedSnapshot.saveSnapshot(state.testPath, state.currentTestName, rawAdapter.serialize(subjectAdapter, subjectOutput), expect);
      state.snapshotState.added++;
    } else if (updateSnapshot === 'none') {
      state.snapshotState.unmatched++;
      expect.fail({
        diff: function diff(output) {
          return output.error('No snapshot available, but running with `--ci`');
        }
      });
    }
  } else {
    expect.withError(function () {
      if (flags.satisfy) {
        expect(subjectRenderer, 'to have rendered', rawAdapter.deserialize(snapshot));
      } else {
        expect(subjectRenderer, 'to have rendered with all children with all wrappers with all classes with all attributes', rawAdapter.deserialize(snapshot));
      }

      state.snapshotState.matched = (state.snapshotState.matched || 0) + 1;
    }, function (err) {
      state.unexpectedSnapshot.markTestAsFailed(state.testPath, state.currentTestName);

      if (state.snapshotState.update === true || state.snapshotState._updateSnapshot === 'all') {
        state.snapshotState.updated++;
        state.unexpectedSnapshot.saveSnapshot(state.testPath, state.currentTestName, rawAdapter.serialize(subjectAdapter, subjectOutput), expect);
      } else {
        state.snapshotState.unmatched++;
        var createDiff = err.getDiffMethod();
        expect.errorMode = 'bubble';
        expect.fail({
          message: function message(output) {
            return output.error('expected ').prismSymbol('<').prismTag(subjectAdapter.getName(subjectOutput)).prismSymbol(' .../> ').error('to match snapshot');
          },
          diff: function diff(output, _diff, inspect, equal) {
            return createDiff(output, _diff, inspect, equal);
          }
        });
      }
    });
  }
}

function injectStateHooks() {
  var state = matchers.getState();
  var snapshotState = state && state.snapshotState;

  if (snapshotState) {
    var originalGetUncheckedCount = state.getUncheckedCount || function () {
      return 0;
    };

    snapshotState.getUncheckedCount = function () {
      var unexpectedState = state.unexpectedSnapshot;

      if (unexpectedState && unexpectedState._files && unexpectedState._files[state.testPath]) {
        return unexpectedState._files[state.testPath].uncheckedKeys.size + originalGetUncheckedCount.call(snapshotState);
      }

      return originalGetUncheckedCount.call(snapshotState);
    };

    var originalRemoveUncheckedKeys = snapshotState.removeUncheckedKeys;

    snapshotState.removeUncheckedKeys = function () {
      var state = matchers.getState();
      var isDirty = false;
      var snapshot = state.unexpectedSnapshot && state.unexpectedSnapshot._files[state.testPath];

      if (snapshot && snapshot.uncheckedKeys.size) {
        snapshot.uncheckedKeys.forEach(function (key) {
          var testName = /(.*)\s[0-9]+$/.exec(key)[1];

          if (!snapshot.failedTests.has(testName)) {
            isDirty = true;
            delete snapshot.allTests[key];
          }
        });
      }

      if (!snapshot || Object.keys(snapshot.allTests).length === 0) {
        var snapshotPath = getSnapshotPath(state.testPath);

        try {
          if (_fs["default"].statSync(snapshotPath).isFile()) {
            _fs["default"].unlinkSync(getSnapshotPath(state.testPath));
          }
        } catch (e) {// We're ignoring file-not-found exceptions, and errors deleting
        }

        if (state.unexpectedSnapshot) {
          delete state.unexpectedSnapshot._files[state.testPath];
        }
      } else if (isDirty) {
        state.unexpectedSnapshot.saveSnapshot(state.testPath, state.currentTestName);
      }

      originalRemoveUncheckedKeys.call(snapshotState);
    };
  }
} // When this module is required, Jest is already started, and the hooks can be added


injectStateHooks();