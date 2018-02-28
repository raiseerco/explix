/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE 
 */

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
    filename: 'esplix-server.js',
    libraryTarget: "umd",
    library: "esplix",
    path: path.resolve(__dirname, 'esplix-server-sdk')
  }
};
