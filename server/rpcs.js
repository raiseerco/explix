/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE
 */

// RPC functions should take two parameters: context and args, and return a promise (async fn works too)

function RPCError(code, message) {
    this.code = code;
    this.message = message;
}


function getContractInstanceIDs(context, args) {
    try {
        const instances = context.contractInstanceManager.getContractInstances();
        const instanceIDs = instances.map( (instance) => instance.getChainID() );
        return Promise.resolve(instanceIDs);
    } catch (e) {
        return Promise.reject(e);
    }
}

function getFields(context, args) {
  if (args.length !== 1) throw new RPCError(-32602, "getFields requires 1 parameter");
  const chainID = args[0];
    try {
        const instance = context.contractInstanceManager.getInstanceByChainID(chainID);
        if (!instance) throw new RPCError(1, "Contract instance not found");
        return Promise.resolve(instance.getFields());
    } catch (e) {
        return Promise.reject(e);
    }
}

function getApplicableActions(context, args) {
  if (args.length !== 1) throw new RPCError(-32602, "getApplicableActions requires 1 parameter");
  const chainID = args[0];
    try {
        const instance = context.contractInstanceManager.getInstanceByChainID(chainID);
        if (!instance) throw new RPCError(1, "Contract instance not found");
        return Promise.resolve(instance.getApplicableActions());
    } catch (e) {
        return Promise.reject(e);
    }
}

function getActionParams(context, args) {
  if (args.length !== 2) throw new RPCError(-32602, "getActionParams requires 2 parameters");
  const chainID = args[0];
  const actionName = args[1];
    try {
        const instance = context.contractInstanceManager.getInstanceByChainID(chainID);
        if (!instance) throw new RPCError(1, "Contract instance not found");
        return Promise.resolve(instance.getActionParams(actionName));
    } catch (e) {
        return Promise.reject(e);
    }
}

function getFieldInfo(context, args) {
  if (args.length !== 1) throw new RPCError(-32602, "getFieldInfo requires 1 parameter");
  const chainID = args[0];
    try {
        const instance = context.contractInstanceManager.getInstanceByChainID(chainID);
        if (!instance) throw new RPCError(1, "Contract instance not found");
        return Promise.resolve(instance.getFieldInfo());
    } catch (e) {
        return Promise.reject(e);
    }
}

function getLastUpdateTime(context, args) {
    if (args.length !== 1) throw new RPCError(-32602, "getFieldInfo requires 1 parameter");
    const chainID = args[0];
    try {
        const instance = context.contractInstanceManager.getInstanceByChainID(chainID);
        if (!instance) throw new RPCError(1, "Contract instance not found");
        return Promise.resolve(instance.getLastUpdateTime());
    } catch (e) {
        return Promise.reject(e);
    }
}

async function checkAction(context, args) {
    if (args.length !== 3) throw new RPCError(-32602, "performAction requires 3 parameters");
    const chainID = args[0];
    const actionName = args[1];
    const actionArgs = args[2];
    const instance = await context.contractInstanceManager.getInstanceByChainID(chainID);
    if (!instance) throw new RPCError(1, "Contract instance not found");
    const res = instance.checkAction(actionName, actionArgs);
    return res.toString();
}

async function performAction(context, args) {
    if (args.length !== 3) throw new RPCError(-32602, "performAction requires 3 parameters");
    const chainID = args[0];
    const actionName = args[1];
    const actionArgs = args[2];
    const instance = await context.contractInstanceManager.getInstanceByChainID(chainID);
    if (!instance) throw new RPCError(1, "Contract instance not found");
    await instance.performAction(actionName, actionArgs);
    return true
}

async function createContractInstance(context, args) {
    if (args.length !== 2) throw new RPCError(-32602, "performAction requires 2 parameters");
    const contractHash = args[0];
    const params = args[1];
    const def = await context.contractDefinitionManager.getByContractHash(contractHash);
    if (!def) throw new RPCError(2, "Contract definition not found");
    try {
        const instance = await context.contractInstanceManager.createContractInstance(
            def, params
        );
        if (!instance) throw new Error("Instance was not created");
        return instance.getChainID();
    } catch (e) {
        console.log(e.stack);
        throw new RPCError(3, "Contract creation failed");
    }
}

module.exports = {
    getContractInstanceIDs,
    getFields,
    getFieldInfo,
    getApplicableActions,
    createContractInstance,
    performAction,
    checkAction,
    getLastUpdateTime
};
