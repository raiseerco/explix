/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE 
 */

export default class LocalStoragePersister {
  constructor(prefix = "") {
    this.prefix = prefix
    if (typeof(Storage) === "undefined") {
      throw Error("no web storage support");
    }
  }

  getData (key) {
    const data = localStorage.getItem(this.prefix + key)
    if (data === null)
      return undefined
    else
      return JSON.parse(data)
  }

  setData (key, value) {
    localStorage.setItem(this.prefix + key,
			 JSON.stringify(value))
  }
}
