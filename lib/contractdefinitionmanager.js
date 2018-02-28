/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE 
 */

import ContractDefinition from './contractdefinition';

const request = require('request');

function fetchBinaryFromURL (url) {
    return new Promise( (resolve, reject) => {
        if (typeof XMLHttpRequest === 'undefined') {
            request({
                method: 'GET',
                url: url,
                encoding: null
            }, (err, response, data) => {
                if (err) reject(err);
                else {
                    if (response.statusCode !== 200) reject(Error("Could not fetch definition"));
                    else resolve(Buffer.from(data))
                }
            });
        } else {
            const httpRequest = new XMLHttpRequest();
            httpRequest.open('GET', url, true);
            httpRequest.responseType = 'arraybuffer';
            httpRequest.onload = function (e) {
                if (httpRequest.status === 200) {
                    resolve(Buffer.from(httpRequest.response));
                } else {
                    reject(Error("Unable to fetch data"))
                }
            };
            httpRequest.onerror = function (e) {
                reject(e);
            };
            httpRequest.send();
        }
    });
}

export default class ContractDefinitionManager {
    constructor(context) {
        this._context = context;
        this._definitionsByHash = {};
        this._allDefinitions = []
    }

    async _initialize(defs) {
        if (defs)
            for (const def of defs)
                this.registerDefinition(def);
    }

    getByContractHash(hash) {
        return this._definitionsByHash[hash];
    }

    getAllDefinitions() {
        return this._allDefinitions;
    }

    registerDefinition(defdata, name) {
        const def = new ContractDefinition(this._context, defdata),
          def1 = this._definitionsByHash[def.contractHash];
        if (def1 && name)
          def1.name = name;
        if (def1)
          return def1;
        if (name)
          def.name = name;
        this._allDefinitions.push(def);
        this._definitionsByHash[def.contractHash] = def;
        return def;
    }

    async registerDefinitionFromURL(url) {
        const data = await fetchBinaryFromURL(url);
        return this.registerDefinition(data);
    }

}
