/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE 
 */

'use strict'
export default class ContractInstanceManager {
  
  constructor (context) {
    this._context = context
    this._contractInstances = []
  }

  async _initialize() {
    const contractInstancesData = await this._context.getData('contractInstancesData')
    if (!contractInstancesData) return
    const cls = this._context.contractInstanceClass
    for (const chainID in contractInstancesData) {
      const instance = new cls(this._context)
      await instance.initializeExisting(chainID, contractInstancesData[chainID])
      this._contractInstances.push(instance)
    }    
  }

  async _saveContractInstances () {
    let data = {}
    for (const instance of this._contractInstances) {
      data[instance.getChainID()] = instance.getMetaData()
    }
    await this._context.setData('contractInstancesData', data)    
  }

  sync () {
    return Promise.all(this._contractInstances.map(
      function (ci) { return ci.sync() }
    )).then( updates => {
      return updates.some(x => x)
    })
  }
  

  getContractInstances () {
    return this._contractInstances
  }

  getInstanceByChainID(id){
     return this._contractInstances.find(el =>  el.getChainID() ===  id )
  }

  async joinContractInstance (chainID, metadata) {
    let instance = this.getInstanceByChainID(chainID);
    if (instance) return instance;
    const cls = this._context.contractInstanceClass;
    instance = new cls(this._context);
    await instance.initializeExisting(chainID, metadata);
    this._contractInstances.push(instance);
    await this._saveContractInstances();
    return instance
  }

  async createContractInstance (contractDefinition, parameters) {
    const cls = this._context.contractInstanceClass;
    const instance = new cls(this._context);
    await instance.initializeNew(contractDefinition, parameters);
    this._contractInstances.push(instance);
    await this._saveContractInstances();

    // TODO: this is hackish way to persist contract instance without local storage
      if (this._context.principalIdentity.isSetUp()) {
          await this._context.invitationManager.invite(instance, this._context.principalIdentity.getPublicKey());
      }

    return instance
  }


}
