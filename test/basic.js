import { expect } from 'chai'
import Context from '../src/context'
import { dummyConfig } from '../src/helper'
import dummyContract from './dummy.ratc'


describe("Context", function () {
  it("initialization", async function () {
    let context = new Context(dummyConfig())
    await context.initialize()
  })
  it("register contract definition", async function () {
    let context = new Context(dummyConfig())
    await context.initialize()
    context.contractDefinitionManager.registerDefinition(dummyContract)
  })
  it("create instance", async function () {
    let context = new Context(dummyConfig())
    await context.initialize()
    context.contractDefinitionManager.registerDefinition(dummyContract)
    await context.contractInstanceManager.createContractInstance(
      context.contractDefinitionManager.getByContractHash('11111111111111111'),
      {owner: "xxxx"}
    )
  })

})
