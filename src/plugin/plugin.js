const { validate } = require("schema-utils");
const schema = require("./schema.json");
const { RawSource } = require("webpack-sources");

// TODO: check if it works with css-modules
// TODO: add comment to each media query about which src file it comes from

//FIXME: fix BREAKING CHANGE WARNING FROM WEBPACK

class ExtractMediaQueriesPlugin {
    static pluginName = "ExtractMediaQueriesPlugin";
    static optionsList = ["oneFile"];
    static mediaQueryRegex = new RegExp("@media[^{]+{([^{}]*{[^}{]*})+[^}]+}", "g");

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
        compilation.assets["ololo.css"] = new RawSource(queries);
    }

    _removeQueriesFromSource() {}

    _extractQueries(source) {
        const queries = source
            .match(ExtractMediaQueriesPlugin.mediaQueryRegex)
            .join("\n \n");

        return queries;
    }

    _process(compilation) {
        const assetStyleNames = Object.keys(compilation.assets).filter((assetName) => {
            return /^\w+.css$/.test(assetName);
        });

        if (!Boolean(assetStyleNames.length)) return Promise.resolve(null);

        assetStyleNames.forEach((styleAsset) => {
            const queries = this._extractQueries(compilation.assets[styleAsset].source());

            this._createAsset(queries, compilation);
        });

        return Promise.resolve();
    }

    apply(compiler) {
        compiler.hooks.emit.tapPromise(
            ExtractMediaQueriesPlugin.pluginName,
            (compilation) =>
                this._process(compilation).then((result) => {
                    return compilation;
                }),
        );
    }
}

module.exports = { ExtractMediaQueriesPlugin };
