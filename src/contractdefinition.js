export default class ContractDefinition {
  constructor (context, defobj) {
    this.contractHash = defobj.contractHash
    context._ratatosk.executionEngine.registerContract(
      defobj.contractHash, defobj.contractCode
    )
    this._annotiations = defobj.annotations || {}
  }

  async beforeAction (action, params) {
    const ann = this._annotations[action]
    if (ann && ann.invite) {
      for (const key of ann.invite) {
	if (params[key]) {
	  await this._context.invitationManager.invite(params[key])
	}
      }
    }
  }

}
