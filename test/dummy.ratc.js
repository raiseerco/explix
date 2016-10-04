function checkSignature(pk, sigs) {
    for (var sig = null, _js_idx1 = 0; _js_idx1 < sigs.length; _js_idx1 += 1) {
        sig = sigs[_js_idx1];
        if (pk === sig.pub) {
            return true;
        };
    };
    return false;
};
function push(ar, value) {
    ar.push(value);
    return ar;
};
var _ = require('lodash');
var contract = { 'actionAvailability' : { provideName : function (fields, pubkeys) {
    return true && fields.name === null && _.intersection([fields.owner], pubkeys);
} },
                 'actions' : { provideName : function (fields, params, signatures) {
    if (!(true && checkSignature(fields.owner, signatures) && true && fields.name === null)) {
        throw new Error('guard check failed');
    };
    fields.name = params.aName;
    return true;
} },
                 'actionParams' : { provideName : { aName : { 'description' : null, 'type' : 'string' } } },
                 'initParams' : { owner : { 'type' : 'pubkey', 'description' : null } },
                 'fieldInfo' : { owner : { 'type' : 'pubkey', 'description' : null }, name : { 'type' : 'string', 'description' : null } },
                 'init' : function (params) {
    if (params['owner'] === undefined) {
        throw new Error('mandatory parameter owner missing');
    };
    return _.defaults(params, { name : null });
}
               };
module.exports = { 'contractHash' : '11111111111111111', 'contractCode' : contract };