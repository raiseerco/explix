'use strict'
//check filepersister module

import FilePersister = from '../src/filepersister.js';

const FilePersisterInstance = new FilePersister();

FilePersisterInstance.setData('testFile.txt', {test: 'testJsonFileStorage1' })