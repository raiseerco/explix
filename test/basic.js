import { expect } from 'chai'
import Context from '../lib/context'
import { dummyConfig } from '../lib/helper'
import { DummyMailbox} from "../lib/dummymailbox"
import * as fs from "mz/fs";

async function dummyContext(configParams) {
    const contractData = await fs.readFile("test/futuristic.r2o");
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
            contractDefinition, { SELLER: Buffer.from("0000", "hex") }
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
        await context2.principalIdentity.generateIdentity();
        const contractInstance = await context.contractInstanceManager.createContractInstance(
            contractDefinition, { SELLER: context.principalIdentity.getPublicKey() }
        );
        await contractInstance.performAction("OFFER", { "PROPERTY-ID": "Frobla" });
        await contractInstance.performAction("INVITE-BROKER",
            { "BROKER-PK": context2.principalIdentity.getPublicKey().toString('hex') });

        await context.update();
        await context2.update();

        const context2_contractInstances = await context2.contractInstanceManager.getContractInstances();

        expect(context2_contractInstances.length).to.equal(1)
    })


});
