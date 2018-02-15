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
        this.name = this._def.name;
        this.fieldInfo = this._def.fieldInfo;
    }

    /* Returns an object, example:
     {
        param1Name: { type: 'string', description: 'some important parameter'}
     }
    */
    getInitParams() {
        return parameterDict(this._def.actions["$INIT"].parameters);
    }

    getFieldInfo() {
        return parameterDict(this.fieldInfo);
    }

    getActionParams(actionName) {
        return parameterDict(this._def.actions[actionName].parameters);
    }

    async beforeAction(contractInstance, action, params) {
        for (const ann of this._def.actions[action].annotations) {
            if (ann[0] === 'INVITE') {
                for (let i = 1; i < ann.length; i++) {
                    const key = ann[i];
                    if (params[key]) {
                        await this._context.invitationManager.invite(contractInstance, params[key]);
                    }
                }
            }
        }
    }

}
