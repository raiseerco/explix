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

  async getContractInstances () {
    return this._contractInstances
  }

  async joinContractInstance (chainID, metadata) {
    const instance = new cls(this._context)
    await instance.initializeExisting(chainID, metadata)
    this._contractInstances.push(instance)
    await this._saveContractInstances()
    return instance
  }

  
  async createContractInstance (contractDefinition, parameters) {
    const cls = this._context.contractInstanceClass
    const instance = new cls(this._context)
    await instance.initializeNew(contractDefinition, parameters)
    this._contractInstances.push(instance)
    await this._saveContractInstances()
    return instance

  }


}
