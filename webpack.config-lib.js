const path = require("path");

module.exports = (env) => {
    console.log(env);
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
                fs: false,
                tls: false,
                net: false,
                path: false,
                zlib: false,
                http: false,
                https: false,
                stream: false,
                crypto: false,
            },
            alias: {
                util: require.resolve("util/"),
            },
        },
    };
};
