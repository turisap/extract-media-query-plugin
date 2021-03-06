const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const { ExtractMediaQueriesPlugin } = require("extract-media-query-plugin");
const { ExtractMediaQueriesPlugin } = require("./src/plugin");

module.exports = {
    entry: "./src/index.tsx",

    mode: "development",

    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
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
        new ExtractMediaQueriesPlugin(),
        new MiniCssExtractPlugin({
            linkType: "text/css",
        }),
    ],

    devtool: "eval-cheap-source-map",

    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: false,
        port: 9000,
    },
};
