import {parameterDict} from './util';

export default class ContractDefinition {
    constructor(context, defdata) {
        this._context = context;
        this._defdata = defdata;

        this._def = context._ratatosk.executionEngine.registerContractDefinition(
            defdata
        );
        this.contractHash = this._def.contractHash;
        this._annotations = {}; // TODO defobj.contractCode.annotations || {}
        this.name = undefined; // TODO defobj.contractName // possibly undefined
    }

    /* Returns an object, example:
     {
        param1Name: { type: 'string', description: 'some important parameter'}
     }
    */
    getInitParams() {
        return parameterDict(this._def.actions["$INIT"].parameters);
    }

    getActionParams(actionName) {
        return parameterDict(this._def.actions[actionName].parameters);
    }

    async beforeAction(contractInstance, action, params) {
        const ann = this._def.actions[action].annotations;
        if (ann && ann.INVITE) {
            for (const key of ann.INVITE) {
                if (params[key]) {
                    await this._context.invitationManager.invite(contractInstance, params[key]);
                }
            }
        }
    }

}
