/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE 
 */

'use strict'
export default class DummyPersister {
  constructor () {
    this.data = {}
  }

  async getData (key) {
    return this.data[key]
  }

  async setData (key, value) {
    this.data[key] = value
  }
  
}
