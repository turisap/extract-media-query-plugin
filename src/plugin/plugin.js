const { validate } = require("schema-utils");
const schema = require("./schema.json");

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

    apply(compiler) {
        compiler.hooks.compilation.tap(
            ExtractMediaQueriesPlugin.pluginName,
            (compilation, params) => {
                // console.log("This is an example plugin!");
                // console.log("CLB", params);
            },
        );
    }
}

module.exports = { ExtractMediaQueriesPlugin };
