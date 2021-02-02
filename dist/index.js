"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

const {
  validate
} = require("schema-utils");

const schema = require("./schema.json");

const {
  RawSource
} = require("webpack-sources");

const {
  Compilation
} = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");

var _options = new WeakMap();

var _sortingMap = new WeakMap();

class ExtractMediaQueriesPlugin {
  constructor(options) {
    var _classPrivateFieldGet2;

    _options.set(this, {
      writable: true,
      value: void 0
    });

    _sortingMap.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _options, options);

    _classPrivateFieldSet(this, _sortingMap, {});

    _classPrivateFieldGet(this, _options).fileName = (_classPrivateFieldGet2 = _classPrivateFieldGet(this, _options).fileName) !== null && _classPrivateFieldGet2 !== void 0 ? _classPrivateFieldGet2 : "queries.css";

    this._validateOptions();
  }

  _validateOptions() {
    validate(schema, _classPrivateFieldGet(this, _options), {
      name: ExtractMediaQueriesPlugin.pluginName
    });
  }

  _addToQueryGroup(query) {
    var _query$match;

    const isMaxWidth = /\(max-width:/.test(query);
    const isMinWidth = /\(min-width:/.test(query);
    const breakPoint = (_query$match = query.match(/\(\w+-\w+:\s*\d+px\)/g)) === null || _query$match === void 0 ? void 0 : _query$match[0];
    const pixelSize = breakPoint === null || breakPoint === void 0 ? void 0 : breakPoint.match(/\d+/g)[0];
    const groupTitle = pixelSize ? `${pixelSize}` : ExtractMediaQueriesPlugin.nonDimensionRelated;
    const subGroup = isMaxWidth ? ExtractMediaQueriesPlugin.maxGroup : isMinWidth ? ExtractMediaQueriesPlugin.minGroup : ExtractMediaQueriesPlugin.nonDimensionRelated;

    if (_classPrivateFieldGet(this, _sortingMap)[groupTitle]) {
      _classPrivateFieldGet(this, _sortingMap)[groupTitle][subGroup].push(query);
    } else {
      if (subGroup !== ExtractMediaQueriesPlugin.nonDimensionRelated) {
        _classPrivateFieldGet(this, _sortingMap)[groupTitle] = {
          min: [],
          max: []
        };

        _classPrivateFieldGet(this, _sortingMap)[groupTitle][subGroup].push(query);
      } else {
        _classPrivateFieldGet(this, _sortingMap)[groupTitle] = {
          [ExtractMediaQueriesPlugin.nonDimensionRelated]: [query]
        };
      }
    }
  }

  _sortQueries(queries) {
    queries.forEach(query => {
      this._addToQueryGroup(query.trim());
    });
    return Object.keys(_classPrivateFieldGet(this, _sortingMap)).sort((a, b) => a - b).reduce((obj, key) => {
      obj[key] = _classPrivateFieldGet(this, _sortingMap)[key];
      return obj;
    }, {});
  }

  _createAsset(queries, compilation) {
    compilation.emitAsset(_classPrivateFieldGet(this, _options).fileName, new RawSource(queries));
  }

  _extractQueries(source) {
    const queries = source.match(ExtractMediaQueriesPlugin.mediaQueryRegex);

    const sorted = this._sortQueries(queries);

    let output = "";

    for (let breakPoint of Object.keys(sorted)) {
      output += `/* ******** This is the ${breakPoint} group ******* */\n\n`;

      for (let subgroup of Object.keys(sorted[breakPoint])) {
        const queries = sorted[breakPoint][subgroup];

        if (queries.length) {
          output += `/* This is ${subgroup} subgroup */\n${queries.join("\n\n")}\n\n`;
        }
      }
    }

    return output;
  }

  _extractRestStyles(source) {
    return source.replace(ExtractMediaQueriesPlugin.mediaQueryRegex, "");
  }

  _process(compilation) {
    const assets = compilation.assets;
    const assetStyleNames = Object.keys(assets).filter(assetName => {
      return /^\w+.css$/.test(assetName);
    });
    if (!Boolean(assetStyleNames.length)) return Promise.resolve(null);
    assetStyleNames.forEach(styleAsset => {
      const styleSrc = assets[styleAsset].source();

      const queries = this._extractQueries(styleSrc);

      this._createAsset(queries, compilation);

      assets[styleAsset] = new RawSource(this._extractRestStyles(styleSrc));
    });
    return Promise.resolve();
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(ExtractMediaQueriesPlugin.pluginName, compilation => {
      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(ExtractMediaQueriesPlugin.pluginName, (data, cb) => {
        data.assets = { ...data.assets,
          css: [...data.assets.css, _classPrivateFieldGet(this, _options).fileName]
        };
        cb();
      });
      compilation.hooks.processAssets.tapPromise({
        name: ExtractMediaQueriesPlugin.pluginName,
        stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
      }, () => {
        this._process(compilation);

        return Promise.resolve();
      });
    });
  }

}

_defineProperty(ExtractMediaQueriesPlugin, "pluginName", "ExtractMediaQueriesPlugin");

_defineProperty(ExtractMediaQueriesPlugin, "optionsList", ["oneFile"]);

_defineProperty(ExtractMediaQueriesPlugin, "nonDimensionRelated", "not dimensions related");

_defineProperty(ExtractMediaQueriesPlugin, "maxGroup", "max");

_defineProperty(ExtractMediaQueriesPlugin, "minGroup", "min");

_defineProperty(ExtractMediaQueriesPlugin, "mediaQueryRegex", new RegExp("(?:\n)*@media[^{]+{([^{}]*{[^}{]*})+[^}]+}", "g"));

_defineProperty(ExtractMediaQueriesPlugin, "tapOptions", {
  name: ExtractMediaQueriesPlugin.pluginName,
  stage: Compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS
});

module.exports = {
  ExtractMediaQueriesPlugin
};