var path = require('path');

module.exports = {
  entry: './lib.es5/index.js',
  output: {
    filename: 'esplix-sdk.js',
    libraryTarget: "umd",
    library: "esplix",
    path: path.resolve(__dirname, 'esplix-sdk')
  }
};
