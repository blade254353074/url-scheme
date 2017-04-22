const path = require('path')
const exclude = /node_modules/

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'url-scheme.js',
    library: 'UrlScheme',
    libraryTarget: 'umd'
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      loader: 'standard-loader',
      options: { parser: 'babel-eslint' },
      exclude
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      options: { cacheDirectory: true },
      exclude
    }]
  }
}
