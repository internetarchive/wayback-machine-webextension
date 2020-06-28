var path = require('path');
var webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: './webextension/scripts/index.js',
  output: {
    path: path.resolve(__dirname, 'webextension/scripts'),
    filename: 'build.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    })
    ,
    new MiniCssExtractPlugin({
      filename: "./webextension/css/style.css",
      chunkFilename: "./webextension/css/style.css"
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
              outputPath: './webextension/images/'
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
              outputPath: './webextension/fonts/'
          }
      }]
      }
    ]
  }
};
