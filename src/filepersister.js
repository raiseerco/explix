'use strict'
const path = require('path');
const fs = require('fs');

module.exports = class FilePersister {
    //config base path

    constructor(basePath = '../testData') { //default path to store files
        this.basePath = path.join(__dirname, basePath);
    }

    async getData(key) {
        const noParsed = localStorage.getItem(key);
        return JSON.parse(noParsed);
    }

    async setData(filename, data/*, rewriteIfExists = false*/) { //replae a data if it aready exists
        const pathToStore = path.join( this.basePath,  filename);
        const dataToStore = JSON.stringify(data);
        await new Promise( function(resolve,  reject) {  //wrap into await
            fs.writeFile(pathToStore, dataToStore,  { flag: 'w' }, (err) => {
                if (err) return reject(err);
                else return resolve();
            });
        });

    }

}
