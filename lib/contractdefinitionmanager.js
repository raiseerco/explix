import ContractDefinition from './contractdefinition';

const request = (typeof XMLHttpRequest === 'undefined') ?
    require('request') : require('browser-request');

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

    registerDefinitionFromURL(url) {
        return new Promise( (resolve, reject) => {
           request({
               method: 'GET',
               url: url,
               encoding: null
           }, (err, response, data) => {
             if (err) reject(err);
             else {
                if (response.statusCode !== 200) reject(Error("Could not fetch definition"));
                else {
                    try {
                        let defdata;
                        console.log(data);
                        if (typeof data === "string") {
                            // workaround for browser-request's inability to handle binary data as buffer
                            defdata = Buffer.from(data, 'binary');
                        } else defdata = Buffer.from(data);
                        console.log(defdata);
                        this.registerDefinition(Buffer.from(defdata));
                    } catch (e) {
                        reject(e); return;
                    }
                    resolve();
                }
             }
           })
        });
    }

}
