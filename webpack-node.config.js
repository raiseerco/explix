/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE
 */

var path = require('path');

module.exports = {
  entry: './lib.es5/index.js',
  target: 'node',
  output: {
    filename: 'esplix-node-sdk.js',
    libraryTarget: "umd",
    library: "esplix",
    path: path.resolve(__dirname, 'esplix-node-sdk')
  }
};
