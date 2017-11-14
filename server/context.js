const esplix = require('../lib.es5');
const fs = require('mz/fs');
const path = require("path");

async function initializeContext(dataDirectory, context, config) {
    await context.initialize();
    if (!context.principalIdentity.isSetUp()) {
        if (config.keypair) {
            await context.principalIdentity.importIdentity(config.keypair)
        } else {
            // TODO: maybe we shouldn't auto-generate keypair
            await context.principalIdentity.generateIdentity();
        }
    }
    const directory = dataDirectory + "/contracts";
    for (const name of await fs.readdir(directory)) {
        const def = context.contractDefinitionManager.registerDefinition(
            await fs.readFile(path.join(directory, name)), name
        );
        console.log("Loaded definition ", def.name, def.contractHash);
    }
    return context
}

exports.createAndInitializeContext = function createAndInitializeContext(dataDirectory, config) {
    let context;
    if (config.mode === "simulated")
        context = createSimulatedContext(config);
    else if (config.mode === "postchain")
        context = createPostchainContext(config);
    else throw Error(`Mode ${config.mode} is not supported`);

    return initializeContext(dataDirectory, context, config);
};

function createSimulatedContext(config) {
    return new esplix.EsplixContext(esplix.dummyConfig());
}

function createPostchainContext(config) {
    const config = esplix.postchainConfig(
        config.postchainURL, // e.g. "http://main-message-store.dv2.bitcontracts.org"
        config.messagingURL  // e.g. "http://messaging.dv.bitcontracts.org"
    );
    // TODO: create a good persister. Dummy is used by default.
    // config.persister = new FilePersister(...);
    return new esplix.EsplixContext(config);

}