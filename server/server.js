const ArgumentParser = require('argparse').ArgumentParser;
const parser = new ArgumentParser({
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
const args = parser.parseArgs();

function keygen(){
    let privKey;
    do {
        privKey = crypto.randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privKey));
    const pubKey = secp256k1.publicKeyCreate(privKey);

    console.log();
    console.log('Private key : ' + privKey.toString('hex'));
    console.log('Public key :  ' + pubKey.toString('hex'));
}

//---- Process start
if (args.keygen){
    keygen();
    process.exit();
}


exports.createContexts(args).then( (contexts) => {
    // create JSON-RPC servers for each context:
    for (const context of contexts) {
        app.post(`/${context._name}/jsonrpc`,
            bodyParser.json(),
            bodyParser.urlencoded({  extended: true   }),
            exports.initJaysonServer(context).middleware()
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
