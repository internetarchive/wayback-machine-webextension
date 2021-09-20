var path = require('path');
var webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: './webextension/scripts/index.js',
  output: {
    path: path.resolve(__dirname, 'webextension'),
    filename: 'scripts/build.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    })
    ,
    new MiniCssExtractPlugin({
      filename: "css/style.css",
      chunkFilename: "css/style.css"
    })
  ],
  stats: {
    colors: true
  },
  devtool: 'source-map',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
              name: '[name].[ext]',   
              outputPath: 'images'
          }
      }]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: {
              name: '[name].[ext]',
              publicPath: '../fonts/',
              outputPath: 'fonts'
          }
      }]
      }
    ]
  }
};
