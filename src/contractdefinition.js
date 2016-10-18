'use strict'
export default class ContractDefinition {
  constructor (context, defobj) {
    this._context = context
    this.contractHash = defobj.contractHash
    context._ratatosk.executionEngine.registerContract(
      defobj.contractHash, defobj.contractCode
    )
    this._annotations = defobj.contractCode.annotations || {}
  }

  async beforeAction (contractInstance, action, params) {
    const ann = this._annotations[action]
    if (ann && ann.invite) {
      for (const key of ann.invite) {
	if (params[key]) {
	  await this._context.invitationManager.invite(contractInstance, params[key])
	}
      }
    }
  }

}
