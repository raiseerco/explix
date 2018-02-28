/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE 
 */

const ArgumentParser = require('argparse').ArgumentParser;
const crypto = require('crypto');
const secp256k1 = require('secp256k1');
const backend = require('./backend');

const bodyParser = require("body-parser");
const express = require('express');


const app = express();
const api = express.Router();

app.use(function(err, req, res, next) {
  if(!err || err.status === 404) return next(); //  TODO: Apparently is required, check if it will be at the end of the implementation
  console.error(err.stack);
  console.error(err);
  res.status(500).send(err);
});

const parser = new ArgumentParser({
    version: '1.0',
    addHelp: true,
    description: 'examples: node esplix-server.js --port=5535 --datadir=Datadir'
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
const args = parser.parseArgs();

function keygen(){
    let privKey;
    do {
        privKey = crypto.randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privKey));
    const pubKey = secp256k1.publicKeyCreate(privKey);

    console.log('"keypair":');
    console.log(JSON.stringify({
      privKey: privKey.toString('hex'),
      pubKey: pubKey.toString('hex')
    }));
}

//---- Process start
if (args.keygen){
    keygen();
    process.exit();
}


backend.createContexts(args).then( (contexts) => {
    // create JSON-RPC servers for each context:
    for (const context of contexts) {
        app.post(`/${context._name}/jsonrpc`,
            bodyParser.json(),
            bodyParser.urlencoded({  extended: true   }),
            backend.initJaysonServer(context).middleware()
        )
    }
    let port = (!args.port ? 5535 : args.port);
    const server = app.listen(port, function() {
        console.log('Esplix server listening at http://%s:%s',
            server.address().address,
            server.address().port);
    });

}).catch( err => {
    console.error(err);
});
