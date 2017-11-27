var path = require('path');

module.exports = {
  entry: './server/server.js',
  target: 'node',
  module: {
    loaders: [
        { test: /\.js$/, loader: "shebang-loader" }
    ]
  },
  output: {
    filename: 'esplix-server-sdk.js',
    libraryTarget: "umd",
    library: "esplix",
    path: path.resolve(__dirname, 'esplix-server-sdk')
  }
};
