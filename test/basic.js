import { expect } from 'chai'
import Context from '../src/context'
import { dummyConfig } from '../src/helper'



describe("Context", function () {
  it("initialization", async function () {
    let context = new Context(dummyConfig())
    await context.initialize()
  })
  it("register contract definition", async function () {
    let context = new Context(dummyConfig())
    await context.initialize()
    context.contractDefinitionManager.registerDefinition(
      {
	contractHash: 'abc',
	contractCode: 'ccc'
      }
    )
  })
  it("create instance", async function () {
    let context = new Context(dummyConfig())
    await context.initialize()
    context.contractDefinitionManager.registerDefinition(
      {
	contractHash: 'abc',
	contractCode: 'ccc'
      }
    )
    await context.contractInstanceManager.createContractInstance(
      context.contractDefinitionManager.getByContractHash('abc'),
      {}
    )
  })

})
