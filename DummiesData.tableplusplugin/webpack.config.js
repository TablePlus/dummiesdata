const webpack = require('webpack');
const path = require('path');

const config = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
};

module.exports = config;