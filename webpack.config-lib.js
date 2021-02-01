const path = require("path");

module.exports = (env) => {
    return {
        entry: "./src/plugin/index.js",
        mode: env.production ? "production" : "development",
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "plugin.js",
            library: "extractMediaQueriesWebpackPlugin",
            libraryExport: "ExtractMediaQueriesWebpackPlugin",
            // TODO: try different ones(commonjs, commonjs2, window, umd, global, this and so on)
            libraryTarget: "umd",
        },

        externals: {
            webpack: "commonjs commonjs2",
            "mini-css-extract-plugin": "commonjs commonjs2",
            "schema-utils": "commonjs commonjs2",
            "webpack-sources": "commonjs commonjs2",
        },

        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /(node_modules)/,
                    use: "babel-loader",
                },
            ],
        },

        resolve: {
            fallback: {
                buffer: require.resolve("buffer/"),
                vm: require.resolve("vm-browserify"),
                os: require.resolve("os-browserify/browser"),
                tty: require.resolve("tty-browserify"),
                constants: require.resolve("constants-browserify"),
                assert: require.resolve("assert/"),
                path: require.resolve("path-browserify"),
                crypto: require.resolve("crypto-browserify"),
                https: require.resolve("https-browserify"),
                http: require.resolve("stream-http"),
                stream: require.resolve("stream-browserify"),
                fs: false,
                console: require.resolve("console-browserify"),
                child_process: false,
                worker_threads: false,
            },
        },
    };
};
