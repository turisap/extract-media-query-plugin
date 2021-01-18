class ExtractMediaQueriesPlugin {
    constructor(options) {
        this.pluginName = "ExtractMediaQueriesPlugin";
    }

    apply(compiler) {
        console.log(compiler);
    }
}

module.exports = { ExtractMediaQueriesPlugin };
