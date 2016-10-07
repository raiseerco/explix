import { expect } from 'chai'
import Context from '../src/context'
import { dummyConfig } from '../src/helper'
import dummyContract from './dummy.ratc'

async function dummyContext () {
  let context = new Context(dummyConfig())
  await context.initialize()
  context.contractDefinitionManager.registerDefinition(dummyContract)
  return context
}

describe("Context", function () {
  it("initialization", async function () {
    let context = new Context(dummyConfig())
    await context.initialize()
  })
  it("register contract definition", async function () {
    const context = await dummyContext()
  })
  
  it("create instance", async function () {
    const context = await dummyContext()
    await context.contractInstanceManager.createContractInstance(
      context.contractDefinitionManager.getByContractHash('11111111111111111'),
      {owner: "xxxx"}
    )
  })
  it("trigger action", async function () {
    const context = await dummyContext()
    await context.principalIdentity.generateIdentity()
    const contractInstance = await context.contractInstanceManager.createContractInstance(
      context.contractDefinitionManager.getByContractHash('11111111111111111'),
      {owner: context.principalIdentity.getPublicKey()}
    )
    await contractInstance.performAction("provideName", {aName: "Frobla"})
  })
  
  

})
