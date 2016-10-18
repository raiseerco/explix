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
