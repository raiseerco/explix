import { expect } from 'chai'
import Context from '../lib/context'
import { dummyConfig } from '../lib/helper'



describe("ContractDefinition", function() {
    it("load from url", async function () {
        let context = new Context(dummyConfig());
        await context.initialize()
        const cdm = context.contractDefinitionManager;
        await cdm.registerDefinitionFromURL("http://localhost:5000/futuristic.r2o");

    });
})

