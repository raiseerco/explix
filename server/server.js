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

var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
  version: '1.0',
  addHelp: true,
  description: 'examples: node esplix-server-sdk.js --port=5535 --datadir=Datadir'
});
parser.addArgument(
  [ '-p', '--port' ],
  {
    help: 'Server listening port'
  }
);
parser.addArgument(
  [ '-d', '--datadir' ],
  {
    help: 'Data directory'
  }
);
parser.addArgument(
  [ '-k', '--keygen' ],
  {
    action: 'storeConst',
    dest:   'keygen',
    help:   'Generate keypair',
    constant: true
  }
);
var args = parser.parseArgs();

app.use(function(err, req, res, next) {
    if(!err || err.status === 404) return next(); //  TODO: Apparently is required, check if it will be at the end of the implementation
    console.error(err.stack);
    console.error(err);
    res.status(500).send(err);
});

exports.createContexts = async function createContexts() {
  console.log("Esplix Server is starting...");
    console.log("Creating contexts...");
    let dataDirectory = (args.datadir == null ? 'server/testdata' : args.datadir);
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

function keygen(){
  var privKey;
  do {
      privKey = crypto.randomBytes(32);
  } while (!secp256k1.privateKeyVerify(privKey));
  var pubKey = secp256k1.publicKeyCreate(privKey);

  console.log();
  console.log('Private key : ' + privKey.toString('hex'));
  console.log('Public key :  ' + pubKey.toString('hex'));
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

exports.initJaysonServer = function initJaysonServer(context){
  return jayson.server(bindRPCs(context));
}

//---- Process start
if (args.keygen){
  keygen();
  process.exit();
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
    let port = (args.port == null ? 5535 : args.port);
    const server = app.listen(port, function() {
        console.log('Esplix server listening at http://%s:%s',
            server.address().address,
            server.address().port);
    });

}).catch( err => {
    console.error(err);
});
