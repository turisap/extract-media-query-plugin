const { validate } = require("schema-utils");
const schema = require("./schema.json");
const { RawSource } = require("webpack-sources");
const { Compilation } = require("webpack");

// TODO: check if it works with css-modules
// TODO: add comment to each media query about which src file it comes from

//FIXME: fix BREAKING CHANGE WARNING FROM WEBPACK

class ExtractMediaQueriesPlugin {
    static pluginName = "ExtractMediaQueriesPlugin";
    static optionsList = ["oneFile"];
    static mediaQueryRegex = new RegExp("@media[^{]+{([^{}]*{[^}{]*})+[^}]+}", "g");
    static tapOptions = {
        name: ExtractMediaQueriesPlugin.pluginName,
        stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
    };

    #options;

    constructor(options) {
        this.#options = options;
        this._validateOptions();
    }

    _validateOptions() {
        validate(schema, this.#options, {
            name: ExtractMediaQueriesPlugin.pluginName,
        });
    }

    _createAsset(queries, compilation) {
        // TODO: make 'em dynamic
        // FIXME: the waring is here
        compilation.hooks.processAssets.tapPromise(
            ExtractMediaQueriesPlugin.tapOptions,
            async (assets) => {
                console.log("EXISTING", assets);
                compilation.emitAsset("emit.css", new RawSource(queries));
            },
        );

        // compilation.assets["ololo.css"] = new RawSource(queries);
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

    _process(compilation) {
        const assets = compilation.getAssets();
        const assetStyleNames = Object.keys(assets).filter((assetName) => {
            return /^\w+.css$/.test(assetName);
        });

        if (!Boolean(assetStyleNames.length)) return Promise.resolve(null);

        assetStyleNames.forEach((styleAsset) => {
            const queries = this._extractQueries(assets[styleAsset].source());

            this._createAsset(queries, compilation);
        });

        return Promise.resolve();
    }

    apply(compiler) {
        compiler.hooks.emit.tapPromise(
            ExtractMediaQueriesPlugin.pluginName,
            (compilation) => {
                return this._process(compilation).then((result) => {
                    return compilation;
                });
            },
        );
    }
}

module.exports = { ExtractMediaQueriesPlugin };
