const { validate } = require("schema-utils");
const schema = require("./schema.json");

// TODO: check if it works with css-modules
// TODO: add comment to each media query about which src file it comes from

class ExtractMediaQueriesPlugin {
    static pluginName = "ExtractMediaQueriesPlugin";
    static optionsList = ["oneFile"];
    static mediaQueryRegex = new RegExp(
        "@media[^{]+{([^{}]*{[^}{]*})+[^}]+}",
        "g",
    );

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

    _extractQueries(source) {
        const queries = source.match(ExtractMediaQueriesPlugin.mediaQueryRegex);

        console.log(queries);
    }

    _process(compilation) {
        const assetStyleNames = Object.keys(compilation.assets).filter(
            (assetName) => {
                return /^\w+.css$/.test(assetName);
            },
        );

        if (!Boolean(assetStyleNames.length)) return Promise.resolve(null);

        assetStyleNames.forEach((styleAsset) => {
            this._extractQueries(compilation.assets[styleAsset].source());
        });

        return Promise.resolve();
    }

    apply(compiler) {
        compiler.hooks.emit.tapPromise(
            ExtractMediaQueriesPlugin.pluginName,
            (compilation) =>
                this._process(compilation).then((result) => {
                    // this.deleteAssets(compilation);
                    // return result;
                    return compilation;
                }),
        );
    }
}

module.exports = { ExtractMediaQueriesPlugin };
