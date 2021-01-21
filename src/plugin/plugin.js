const { validate } = require("schema-utils");
const schema = require("./schema.json");
const { RawSource } = require("webpack-sources");
const { Compilation } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
        // compilation.hooks.processAssets.tapPromise(
        //     ExtractMediaQueriesPlugin.tapOptions,
        //     (assets) => {
        //         console.log("EXISTING", assets);
        //         ;
        //     },
        // );

        compilation.emitAsset("compile.css", new RawSource(queries));
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
        const assets = compilation.assets;
        const assetStyleNames = Object.keys(assets).filter((assetName) => {
            return /^\w+.css$/.test(assetName);
        });

        console.log("ASSETS", assets);

        if (!Boolean(assetStyleNames.length)) return Promise.resolve(null);

        assetStyleNames.forEach((styleAsset) => {
            const queries = this._extractQueries(assets[styleAsset].source());

            this._createAsset(queries, compilation);
        });

        return Promise.resolve();
    }

    apply(compiler) {
        compiler.hooks.compilation.tap("MyPlugin", (compilation) => {
            console.log("The compiler is starting a new compilation...");

            // Static Plugin interface |compilation |HOOK NAME | register listener
            HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
                "MyPlugin", // <-- Set a meaningful name here for stacktraces
                (data, cb) => {
                    console.log(data);
                    // Manipulate the content
                    data.html =
                        "<!DOCTYPE html>\n" +
                        '<html lang="en">\n' +
                        "    <head>\n" +
                        '        <meta charset="UTF-8" />\n' +
                        "        <title>Webpack media extractor plugin</title>\n" +
                        '    <link href="main.css" rel="stylesheet">' +
                        '    <link href="compile.css" rel="stylesheet">' +
                        "</head>\n" +
                        "    <body>\n" +
                        "        <p>Hello plugin!</p>\n" +
                        '        <div id="app"></div>\n' +
                        '    <script src="main.js"></script></body>\n' +
                        "</html>\n";
                    // Tell webpack to move on
                    cb(null, data);
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
