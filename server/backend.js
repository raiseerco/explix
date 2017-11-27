const express = require('express');
const fs = require("mz/fs");
const path = require("path");
const jayson = require("jayson");
const bodyParser = require("body-parser");
console.log("Loading Esplix engine...");
const createAndInitializeContext = require('./context').createAndInitializeContext;
const rpcs = require('./rpcs');
const crypto = require('crypto');
const secp256k1 = require('secp256k1');

const app = express();
const api = express.Router();

app.use(function(err, req, res, next) {
    if(!err || err.status === 404) return next(); //  TODO: Apparently is required, check if it will be at the end of the implementation
    console.error(err.stack);
    console.error(err);
    res.status(500).send(err);
});

exports.createContexts = async function createContexts(args) {
  console.log("Esplix Server is starting...");
    console.log("Creating contexts...");
    let dataDirectory = ((! args.datadir) ? 'server/testdata' : args.datadir);
    const contextsDir = dataDirectory + "/contexts";
    const contexts = [];
    for (const name of await fs.readdir(contextsDir)) {
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

