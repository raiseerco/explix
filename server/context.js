const esplix = require('../lib.es5');
const fs = require('mz/fs');

async function initializeContext(context, config) {
    await context.initialize();
    if (!context.principalIdentity.isSetUp()) {
        if (config.keypair) {
            await context.principalIdentity.importIdentity(config.keypair)
        } else {
            // TODO: maybe we shouldn't auto-generate keypair
            await context.principalIdentity.generateIdentity();
        }
    }
    for (const name of await fs.readdir("./contracts")) {
        context.contractDefinitionManager.registerContractDefinition(
            await fs.readFile(name)
        );
    }
    return context
}

exports.createContext = function createContext(config) {
    if (config.mode === "simulated")
        return createSimulatedContext(config);
    else if (config.mode === "postchain")
        return createPostchainContext(config);
    else throw Error(`Mode ${config.mode} is not supported`)
};

function createSimulatedContext(config) {
    return initializeContext(new esplix.EsplixContext(esplix.dummyConfig()), config);
}

function createPostchainContext(config) {
    const config = esplix.postchainConfig(
        config.postchainURL, // e.g. "http://main-message-store.dv2.bitcontracts.org"
        config.messagingURL  // e.g. "http://messaging.dv.bitcontracts.org"
    );
    // TODO: create a good persister. Dummy is used by default.
    // config.persister = new FilePersister(...);
    return initializeContext(new esplix.EsplixContext(config), config);

}