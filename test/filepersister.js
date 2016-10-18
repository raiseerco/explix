'use strict'
//check filepersister module

const FilePersister = require('../src/filepersister.js');

const FilePersisterInstance = new FilePersister();

FilePersisterInstance.setData('testFile.txt', {test: 'testJsonFileStorage1' })