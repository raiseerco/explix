'use strict'
import express from 'express';
import path from 'path';
import ContractInstance from '../lib/contractinstance';


import { dummyConfig } from '../lib/helper'
import Context from '../lib/context'
import dummyContract from '../test/dummy.ratc'

const app = express();
const api = express.Router();


/*context.contractInstanceManager.getContractInsances();*/
async function dummyContext(configParams) {
    const context = new Context(dummyConfig(configParams))
    await context.initialize()
    context.contractDefinitionManager.registerDefinition(dummyContract)
    return context
}
const context = await dummyContext();


//must be JSON RPC
api.get('/contracts', async(req, res, next) => {
    const contractIds = await context.contractInstanceManager.getContractInstances().map(el => getChainID());
    return res.json({ data: contractIds });
});

api.get('/contracts/:chainId/', async(req, res, next) => {
    const result = await context.contractInstanceManager.getContractInstances().map(el => getChainID());
    return res.json({ data: result });
});

api.get('/contracts/:chainId/fields', async(req, res, next) => {
    const result = await context.contractInstanceManager.getInstanceByChainID(req.param.chainId).getFields();
    return res.json({ data: result });
});

api.get('/contracts/:chainId/actions', async(req, res, next) => {
    const result = await context.contractInstanceManager.getInstanceByChainID(req.param.chainId).getApplicableActions();
    return res.json({ data: result });
});

api.get('/contracts/:chainId/action-params', async(req, res, next) => {
    const result = await context.contractInstanceManager.getInstanceByChainID(req.param.chainId).getActionParams();
    return res.json({ data: result });
});

post.get('/contracts/:chainId/action', async(req, res, next) => {
    const result = await context.contractInstanceManager.getInstanceByChainID(req.param.chainId).performAction();
    return res.json({ data: result });
});




app.use('/', api);


const server = app.listen(3000, function() {
    console.log('process.env.NODE_ENV = ' + process.env.NODE_ENV);
    console.log('Example app listening at http://%s:%s', server.address().address, server.address().port);
    console.log('environment mode ' + app.get('env'));
});
