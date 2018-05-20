/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE 
 */

const expect = require('chai').expect;
const esplix = require('../lib.es5');
const Context = esplix.EsplixContext;
const dummyConfig = esplix.dummyConfig;
const DummyMailbox = esplix.DummyMailbox;
const fs = require('mz/fs');

async function dummyContext(configParams) {
    const contractData = await fs.readFile("test/futuristic.r4o");
    const context = new Context(dummyConfig(configParams));
    await context.initialize();
    const contractDefinition = context.contractDefinitionManager.registerDefinition(contractData);
    return { context, contractDefinition }
}

describe("Context", function() {

    this.timeout(50000);

    it("initialization", async function() {
        let context = new Context(dummyConfig());
        await context.initialize()
    });

    it("register contract definition", async function() {
        const { context, contractDefinition } = await dummyContext()
    });

    it("create instance", async function() {
        const { context, contractDefinition } = await dummyContext();
        await context.contractInstanceManager.createContractInstance(
            contractDefinition, { SELLER: "0000" }
        );
    });

    it("trigger action", async function() {
        const { context, contractDefinition } = await dummyContext();
        await context.principalIdentity.generateIdentity();
        const contractInstance = await context.contractInstanceManager.createContractInstance(
            contractDefinition, { SELLER: context.principalIdentity.getPublicKey() }
        );
        await contractInstance.performAction("OFFER", { "PROPERTY-ID": "Frobla" })
    });

    it("invitation", async function() {
        const { context, contractDefinition } = await dummyContext();
        // create the second context in such a way that it shares message store (consensusEngine) and mailbox manager
        const context2 = (await dummyContext({
            consensusEngine: context._ratatosk.consensusEngine,
            mailbox: new DummyMailbox(context._mailbox.manager)
        })).context;
        await context.principalIdentity.generateIdentity();
        await context.principalIdentity.generatePubKey(context.principalIdentity.getPrivateKey());
        await context2.principalIdentity.generateIdentity();
        const contractInstance = await context.contractInstanceManager.createContractInstance(
            contractDefinition, { SELLER: context.principalIdentity.getPublicKey() }
        );
        expect(contractInstance.checkAction("OFFER", { "PROPERTY-ID": "Frobla" })).to.equal("ok");
        expect(contractInstance.checkAction("OFIR", { "PROPERTY-ID": "Frobla" })).to.be.an("error");
        expect(contractInstance.checkAction("OFFER", { "PROPERTY-ID": 123 })).to.be.an("error");
        await contractInstance.performAction("OFFER", { "PROPERTY-ID": "Frobla" });
        await contractInstance.performAction("INVITE-BROKER",
            { "BROKER-PK": context2.principalIdentity.getPublicKey().toString('hex') });

        await context.update();
        await context2.update();

        const context2_contractInstances = await context2.contractInstanceManager.getContractInstances();

        expect(context2_contractInstances.length).to.equal(1);
        expect(contractInstance.getMessageChain().length).to.equal(3);
        expect(contractInstance.hasSyncErrors()).to.equal(false);
        expect(contractInstance.getLastUpdateTime()).to.be.above(0);


    })


});
