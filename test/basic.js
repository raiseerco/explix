import { expect } from 'chai'
import Context from '../lib/context'
import { dummyConfig } from '../lib/helper'
import dummyContract from './dummy.ratc'

async function dummyContext(configParams) {
    const context = new Context(dummyConfig(configParams))
    await context.initialize()
    context.contractDefinitionManager.registerDefinition(dummyContract)
    return context
}

const dummyContractHash = '11111111111111111'

describe("Context", function() {
    it("initialization", async function() {
        let context = new Context(dummyConfig())
        await context.initialize()
    })
    it("register contract definition", async function() {
        const context = await dummyContext()
    })

    it("create instance", async function() {
        const context = await dummyContext()
        await context.contractInstanceManager.createContractInstance(
            context.contractDefinitionManager.getByContractHash(dummyContractHash), { owner: "xxxx" }
        )
    })
    it("trigger action", async function() {
        const context = await dummyContext()
        await context.principalIdentity.generateIdentity()
        const contractInstance = await context.contractInstanceManager.createContractInstance(
            context.contractDefinitionManager.getByContractHash(dummyContractHash), { owner: context.principalIdentity.getPublicKey() }
        )
        await contractInstance.performAction("provideName", { aName: "Frobla" })
    })
    it("invitation", async function() {
        const context1 = await dummyContext()
        const context2 = await dummyContext({ consensusEngine: context1._ratatosk.consensusEngine })
        await context1.principalIdentity.generateIdentity()
        await context2.principalIdentity.generateIdentity()
        const contractInstance = await context1.contractInstanceManager.createContractInstance(
            context1.contractDefinitionManager.getByContractHash(dummyContractHash), { owner: context1.principalIdentity.getPublicKey() }
        )
        await contractInstance.performAction("provideName", { aName: context2.principalIdentity.getPublicKey() })
        await context1._messageDispatcher.update()
        await context2._messageDispatcher.update()

        const context2_contractInstances = await context2.contractInstanceManager.getContractInstances()

        expect(context2_contractInstances.length).to.equal(1)
    })


})
