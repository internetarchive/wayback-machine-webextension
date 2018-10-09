var path = require('path');
var webpack = require('webpack');
module.exports = {
  entry: './scripts/index.js',
  output: {
    path: path.resolve(__dirname, 'scripts'),
    filename: 'build.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  stats: {
    colors: true
  },
  devtool: 'source-map',
  mode: 'production',
};
