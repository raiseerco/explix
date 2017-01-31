'use strict'
import ContractDefinition from './contractdefinition'

export default class ContractDefinitionManager {
  constructor (context) {
    this._context = context
    this._definitionsByHash = {}
    this._allDefinitions = []
  }

  async _initialize(defs) {
    if (defs)
      for (const def of defs)
	this.registerDefinition(def)
  }

  getByContractHash (hash) {
    return this._definitionsByHash[hash]
  }

  getAllDefinitions () { return this._allDefinitions }
  
  registerDefinition (defJSON) {
    const def = new ContractDefinition(this._context, defJSON)
    this._allDefinitions.push(def)
    this._definitionsByHash[def.contractHash] = def
  }
  
}
