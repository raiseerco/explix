'use strict'
export default class LocalStoragePersister {
    constructor() {
        if (typeof(Storage) === "undefined") {
            throw new Error("no web storage support");
        }
    }

    getData(key) {
        return  localStorage.getItem(key) !== undefined ? 
            toReturn = JSON.parse(  localStorage.getItem(key)  ) : undefined;
    }

    setData(key, value) {
        const toStore = (typeof value === "string" ? value : JSON.stringify(value));
        localStorage.setItem( key, toStore);
    }

}