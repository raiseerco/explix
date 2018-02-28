/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE 
 */

var path = require('path');

module.exports = {
  entry: './lib.es5/index.js',
  output: {
    filename: 'esplix-browser-sdk.js',
    libraryTarget: "umd",
    library: "esplix",
    path: path.resolve(__dirname, 'esplix-browser-sdk')
  }
};
