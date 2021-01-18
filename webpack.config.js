const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { ExtractMediaQueriesPlugin } = require("./src/plugin/plugin");

module.exports = {
    entry: "./src/index.tsx",

    mode: "development",

    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(ts|tsx)$/,
                loader: "awesome-typescript-loader",
            },
        ],
    },

    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },

    output: {
        path: path.resolve(__dirname, "build"),
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html"),
        }),
        new CleanWebpackPlugin(),
        // new ExtractMediaQueriesPlugin(),
    ],

    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
    },
};
