import MessageChainController from 'ratatoskr/ratlib/controller'

export default class ContractInstance {
  
  constructor (context) {
    this._context = context
    const rat = context._ratatosk
    this._mcc = new MessageChainController(rat.executionEngine, rat.consensusEngine)
    this._initialized = false
    this.contractDefinition = null
  }

  async initializeExisting (chainID) {
    await this._mcc.initializeExisting(chainID)
    this.contractDefinition = this._context.contractDefinitionManager.getByContractHash(
      this._mcc.messageChain.contractHash
    )
    if (!this.contractDefinition) throw Error("contract definition not found")
    this._initialized = true
    return
  }

  async initializeNew (contractDefinition, parameters) {
    const contractHash = contractDefinition.contractHash
    await this._mcc.initializeNew(contractHash, parameters)
    this._initialized = true
    this.contractDefinition = contractDefinition
    return
  }

  getChainID () {
    if (!this._initialized) throw Error('not initialized')
    return this._mcc.chainID
  }

  getMetaData () { return {} }

  async performAction (action, data) {
    if (!this._initialized) throw Error('not initialized')
    const keypair = this._context.principalIdentity 
    const msg = this._mcc.makeMessage(action, data,
				      [keypair.getPrivateKey()])
    if (!msg) throw Error()
    await this.contractDefinition.beforeAction(action, data)
    await this._mcc.postMessage(msg)
    return
  }

  

  
  
}
