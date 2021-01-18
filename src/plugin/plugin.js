const { validate } = require("schema-utils");
const schema = require("./schema.json");

// TODO: check if it works with css-modules

class ExtractMediaQueriesPlugin {
    static pluginName = "ExtractMediaQueriesPlugin";
    static optionsList = ["oneFile"];
    #options;

    constructor(options) {
        this.#options = options;
        this._validateOptions();
    }

    _validateOptions() {
        validate(schema, this.#options, {
            name: ExtractMediaQueriesPlugin.pluginName,
            baseDataPath: "options",
        });
    }

    _process(compilation) {
        console.log(Object.keys(compilation.assets));
        // FIXME: definitely bad idea
        compilation.assets["main.css"]._source._children.forEach((resource) => {
            console.log(resource._value);
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
