const { validate } = require("schema-utils");
const schema = require("./schema.json");
const { RawSource } = require("webpack-sources");
const { Compilation } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

class ExtractMediaQueriesPlugin {
    static pluginName = "ExtractMediaQueriesPlugin";
    static optionsList = ["oneFile"];
    static nonDimensionRelated = "not dimensions related";
    static maxGroup = "max";
    static minGroup = "min";
    static mediaQueryRegex = new RegExp(
        "(?:\n)*@media[^{]+{([^{}]*{[^}{]*})+[^}]+}",
        "g",
    );
    static tapOptions = {
        name: ExtractMediaQueriesPlugin.pluginName,
        stage: Compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS,
    };

    #options;
    #sortingMap;

    constructor(options) {
        this.#options = options;
        this.#sortingMap = {};
        this.#options.fileName = this.#options.fileName ?? "queries.css";
        this._validateOptions();
    }

    _validateOptions() {
        validate(schema, this.#options, {
            name: ExtractMediaQueriesPlugin.pluginName,
        });
    }

    _addToQueryGroup(query) {
        const isMaxWidth = /\(max-width:/.test(query);
        const isMinWidth = /\(min-width:/.test(query);

        const breakPoint = query.match(/\(\w+-\w+:\s*\d+px\)/g)?.[0];
        const pixelSize = breakPoint?.match(/\d+/g)[0];
        const groupTitle = pixelSize
            ? `${pixelSize}`
            : ExtractMediaQueriesPlugin.nonDimensionRelated;

        const subGroup = isMaxWidth
            ? ExtractMediaQueriesPlugin.maxGroup
            : isMinWidth
            ? ExtractMediaQueriesPlugin.minGroup
            : ExtractMediaQueriesPlugin.nonDimensionRelated;

        if (this.#sortingMap[groupTitle]) {
            this.#sortingMap[groupTitle][subGroup].push(query);
        } else {
            if (subGroup !== ExtractMediaQueriesPlugin.nonDimensionRelated) {
                this.#sortingMap[groupTitle] = {
                    min: [],
                    max: [],
                };

                this.#sortingMap[groupTitle][subGroup].push(query);
            } else {
                this.#sortingMap[groupTitle] = {
                    [ExtractMediaQueriesPlugin.nonDimensionRelated]: [query],
                };
            }
        }
    }

    _sortQueries(queries) {
        queries.forEach((query) => {
            this._addToQueryGroup(query.trim());
        });

        return Object.keys(this.#sortingMap)
            .sort((a, b) => a - b)
            .reduce((obj, key) => {
                obj[key] = this.#sortingMap[key];
                return obj;
            }, {});
    }

    _createAsset(queries, compilation) {
        compilation.emitAsset(this.#options.fileName, new RawSource(queries));
    }

    _extractQueries(source) {
        const queries = source.match(ExtractMediaQueriesPlugin.mediaQueryRegex);
        const sorted = this._sortQueries(queries);

        let output = "";

        for (let breakPoint of Object.keys(sorted)) {
            output += `/* ******** This is the ${breakPoint} group ******* */\n\n`;

            for (let subgroup of Object.keys(sorted[breakPoint])) {
                output += `/* This is ${subgroup} subgroup */\n${sorted[breakPoint][
                    subgroup
                ].join("\n\n")}\n\n`;
            }
        }

        return output;
    }

    _extractRestStyles(source) {
        return source.replace(ExtractMediaQueriesPlugin.mediaQueryRegex, "");
    }

    _process(compilation) {
        const assets = compilation.assets;
        const assetStyleNames = Object.keys(assets).filter((assetName) => {
            return /^\w+.css$/.test(assetName);
        });

        if (!Boolean(assetStyleNames.length)) return Promise.resolve(null);

        assetStyleNames.forEach((styleAsset) => {
            const styleSrc = assets[styleAsset].source();
            const queries = this._extractQueries(styleSrc);

            this._createAsset(queries, compilation);

            assets[styleAsset] = new RawSource(this._extractRestStyles(styleSrc));
        });

        return Promise.resolve();
    }

    apply(compiler) {
        compiler.hooks.compilation.tap(
            ExtractMediaQueriesPlugin.pluginName,
            (compilation) => {
                HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
                    ExtractMediaQueriesPlugin.pluginName,
                    (data, cb) => {
                        data.assets = {
                            ...data.assets,
                            css: [...data.assets.css, this.#options.fileName],
                        };
                        cb();
                    },
                );
            },
        );

        compiler.hooks.emit.tapPromise(
            ExtractMediaQueriesPlugin.pluginName,
            (compilation) => {
                return this._process(compilation).then(() => {
                    return compilation;
                });
            },
        );
    }
}

module.exports = { ExtractMediaQueriesPlugin };
