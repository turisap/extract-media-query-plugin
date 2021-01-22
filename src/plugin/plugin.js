const { validate } = require("schema-utils");
const schema = require("./schema.json");
const { RawSource } = require("webpack-sources");
const { Compilation } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// TODO: check if it works with css-modules
// TODO: add comment to each media query about which src file it comes from

class ExtractMediaQueriesPlugin {
    static pluginName = "ExtractMediaQueriesPlugin";
    static optionsList = ["oneFile"];
    static mediaQueryRegex = new RegExp("@media[^{]+{([^{}]*{[^}{]*})+[^}]+}", "g");
    static tapOptions = {
        name: ExtractMediaQueriesPlugin.pluginName,
        stage: Compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS,
    };

    #options;

    constructor(options) {
        this.#options = options;
        this.#options.fileName = this.#options.fileName ?? "queries.css";
        this._validateOptions();
    }

    _validateOptions() {
        validate(schema, this.#options, {
            name: ExtractMediaQueriesPlugin.pluginName,
        });
    }

    _createAsset(queries, compilation) {
        compilation.emitAsset(this.#options.fileName, new RawSource(queries));
    }

    _removeQueriesFromSource() {
        // NEXT: you need to find out how to remove queries from the source
        // and fix the breaking change warging
    }

    _extractQueries(source) {
        const queries = source
            .match(ExtractMediaQueriesPlugin.mediaQueryRegex)
            .join("\n \n");

        return queries;
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
        compiler.hooks.compilation.tap("MyPlugin", (compilation) => {
            console.log("The compiler is starting a new compilation...");

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
        });

        compiler.hooks.emit.tapPromise(
            ExtractMediaQueriesPlugin.pluginName,
            (compilation) => {
                return this._process(compilation).then((result) => {
                    return "asdlkfj";
                });
            },
        );
    }
}

module.exports = { ExtractMediaQueriesPlugin };
