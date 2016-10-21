'use strict'
import ContractDefinition from './contractdefinition'

export default class ContractDefinitionManager {
  constructor (context) {
    this._context = context
    this._definitionsByHash = {}
  }

  async _initialize() {}

  getByContractHash (hash) {
    return this._definitionsByHash[hash]
  }

  registerDefinition (defJSON) {
    const def = new ContractDefinition(this._context, defJSON)
    this._definitionsByHash[def.contractHash] = def
  }
  
}
