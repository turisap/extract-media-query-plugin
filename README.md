# Extract-Meida-Query-Plugin

A webpack plugin which extracts media queries from all your compiled `css` into a separate file and sorts them by breakpoints and groups

## Installation

`npm i extract-media-query-plugin`

`yarn add extract-media-query-plugin`

## Usage

In your `webpack.config.js` `rules` section

```
const { ExtractMediaQueriesPlugin } = require("extract-media-query-plugin");

  {
    test: /\.scss$/i,
    use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
  }

```

and in your plugins

```
  plugins: [
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "index.html"),
    }),
    new ExtractMediaQueriesPlugin({
        fileName: "queries.css", // this is the default filename
    }),
    new MiniCssExtractPlugin({
        linkType: "text/css",
    }),
  ]
```

Keep in mind that the plugin is used along with `MiniCssExtractPlugin.loader` and `css-loader`. Also, `MiniCssExtractPlugin` was used to extract styles to later process by the plugin as well as `HtmlWebpackPlugin` to insert the newly created stylesheet into the html. I am not sure how it will work with other setups if it will :) However, you can you `less-loader` or other loaders to process your styles, just bear in mind that this plugin relies on the fact that all your styles have been processed and emitted as a separate stylesheet.

## Contributing

Pull requests are welcome.
