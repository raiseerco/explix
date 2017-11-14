console.log("Esplix Server is starting...");
const express = require('express');
const fs = require("mz/fs");
const path = require("path");
const jayson = require("jayson");
const bodyParser = require("body-parser");
console.log("Loading Esplix engine...");
const createAndInitializeContext = require('./context').createAndInitializeContext;
const rpcs = require('./rpcs');

const app = express();
const api = express.Router();

app.use(function(err, req, res, next) {
    if(!err || err.status === 404) return next(); //  TODO: Apparently is required, check if it will be at the end of the implementation
    console.error(err.stack);
    console.error(err);
    res.status(500).send(err);
});


exports.createContexts = async function createContexts() {
    console.log("Creating contexts...");
    let dataDirectory;
    if (process.argv.length > 2) {
        dataDirectory = process.argv[2];
        console.log("Using data directory", dataDirectory);
    } else {
        dataDirectory = "server/testdata";
        console.log("Data directory name not provided using, test data (testdata)");
    }
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
}

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

exports.createContexts().then( (contexts) => {
    // create JSON-RPC servers for each context:
    for (const context of contexts) {
        app.post(`/${context._name}/jsonrpc`,
            bodyParser.json(),
            bodyParser.urlencoded({  extended: true   }),
            exports.initJaysonServer(context).middleware()
        )
    }
    const server = app.listen(5535, function() {
        console.log('Esplix server listening at http://%s:%s',
            server.address().address,
            server.address().port);
    });

}).catch( err => {
    console.error(err);
});

exports.initJaysonServer = function initJaysonServer(context){
  return jayson.server(bindRPCs(context));
}
