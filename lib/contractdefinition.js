'use strict'
export default class ContractDefinition {
  constructor (context, defobj) {
    this._context = context
    this._defobj = defobj
    this.contractHash = defobj.contractHash
    context._ratatosk.executionEngine.registerContract(
      defobj.contractHash, defobj.contractCode
    )
    this._annotations = defobj.contractCode.annotations || {}
    this.name = defobj.contractName // possibly undefined
  }

  /* 
     Returns an object, example: 
     {
       param1Name: { type: 'string', description: 'some important parameter'}
     }
   */
  getInitParams() {
    return this._defobj.initParams
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
