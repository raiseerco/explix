'use strict'
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

  getFields(){
    return this._mcc.messageChain.getContractState().getFields();
  } 
  
  getApplicableActions( pubkeys ){
    pubkeys = pubkeys || this._context.principalIdentity.getPublicKey();
    return this._mcc.messageChain.getContractState().getApplicableActions( pubkeys );
  } 

  async getActionParams(){
     return await this._mcc.messageChain.getContractState().getActionParams();
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
    if (!msg) throw new Error()
    await this.contractDefinition.beforeAction(this, action, data)
    await this._mcc.postMessage(msg)
    return
  } 
  
}