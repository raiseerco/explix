/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE 
 */

const fs = require("mz/fs");
const path = require("path");
const jayson = require("jayson");
console.log("Loading Esplix engine...");
const createAndInitializeContext = require('./context').createAndInitializeContext;
const rpcs = require('./rpcs');

exports.createContexts = async function createContexts(args) {
  console.log("Esplix Server is starting...");
    console.log("Creating contexts...");
    let dataDirectory = ((! args.datadir) ? 'server/testdata' : args.datadir);
    const contextsDir = dataDirectory + "/contexts";
    const contexts = [];
    for (const name of await fs.readdir(contextsDir)) {
        console.log("Loading context", name);
        const config = JSON.parse(await fs.readFile(
            path.join(contextsDir, name)
        ));
        const context = await createAndInitializeContext(dataDirectory, config);
        context._name = name;
        contexts.push(context);
    }
    return contexts;
};


function createRPCFunction(context, name, backendFN) {
    return async (args, callback) => {
        try {
            callback(null, await backendFN(context, args));
        } catch (e) {
            callback(e);
        }
    }
}

function bindRPCs(context) {
    const object = {};
    for (const rpcName in rpcs) {
        if (rpcs.hasOwnProperty(rpcName)) {
            object[rpcName] = createRPCFunction(context, rpcName, rpcs[rpcName]);
        }
    }
    return object;
}

exports.initJaysonServer = function initJaysonServer(context){
  return jayson.server(bindRPCs(context));
};

