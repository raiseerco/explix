var path = require('path');

module.exports = {
  entry: './server/server.js',
  target: 'node',
  output: {
    filename: 'esplix-server-sdk.js',
    libraryTarget: "umd",
    library: "esplix",
    path: path.resolve(__dirname, 'esplix-server-sdk')
  }
};
