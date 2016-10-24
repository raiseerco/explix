'use strict'
import express from 'express';
import path from 'path';
import jayson from 'jayson';

import ContractInstance from '../lib/contractinstance';
import { dummyConfig } from '../lib/helper'
import Context from '../lib/context'
import dummyContract from '../test/dummy.ratc'

const app = express();
const api = express.Router();
const bodyParser = require('body-parser');


(async function() {
    /*Initialize context here*/
    async function dummyContext(configParams) {
        const context = new Context(dummyConfig(configParams));
        await context.initialize();
        context.contractDefinitionManager.registerDefinition(dummyContract);
        return context;
    }
    const context = await dummyContext();
    const dummyContractHash = '11111111111111111'
    await context.principalIdentity.generateIdentity()
    const contractInstance = await context.contractInstanceManager.createContractInstance(
        context.contractDefinitionManager.getByContractHash(dummyContractHash), { owner: context.principalIdentity.getPublicKey() }
    )



    //requests path POST '/contracts'
    const contracts = {
        /*request example
            {   
                "jsonrpc": "2.0", 
                "id":"1",
                "method":"getContractIds"
            }
        */
        getContractIds: async function(args, callback) {
            const contracts = await context.contractInstanceManager.getContractInstances();
            const contractIds = contracts.map(el => el.getChainID());
            callback(null, contractIds);
        },

        /*request example
           {"jsonrpc": "2.0", 
            "id":"1",
            "method":"getFields", 
            "params": {"id": {{contract id}}} }
        */
        getFields: async function(args, callback) {
            const contract = await context.contractInstanceManager.getInstanceByChainID(args.id);

            if (!contract) {
                var error = { code: 404, message: 'Cannot find chain id ' + args.id };
                callback(error); // will return the error object as given
            } else {
                return callback(null, contract.getFields());
            }
        },

        /*request example
        {   "jsonrpc": "2.0", 
            "id":"1",
            "method":"getActions", 
            "params": {"id": {{contract id}}} }
        */
        getActions: async function(args, callback) {
            const contract = await context.contractInstanceManager.getInstanceByChainID(args.id);

            if (!contract) {
                var error = { code: 404, message: 'Cannot find chain id ' + args.id };
                callback(error); // will return the error object as given
            } else {
                return callback(null, contract.getApplicableActions());
            }

        },

        /*request example
        {   "jsonrpc": "2.0", 
            "id":"1",
            "method":"getActionParams", 
            "params": {"id": {{contract id}}} }
        */
        getActionParams: async function(args, callback) {
            const contract = await context.contractInstanceManager.getInstanceByChainID(args.id);

            if (!contract) {
                var error = { code: 404, message: 'Cannot find chain id ' + args.id };
                callback(error); // will return the error object as given
            } else {
                const result = contract.getActionParams()
                return callback(null, result);
            }
        },


         /*request example
        {   "jsonrpc": "2.0", 
            "id":"1",
            "method":"getActionParams", 
            "params": 
                {
                    "name": {{action name}}
                    "object" : {{action object}}
                } 
            }
        */
        performAction: async function(args, callback) {
            const contract = await context.contractInstanceManager.getInstanceByChainID(args.id);
            const name = args.name;
            try{
                const object = JSON.parse()
            }catch(err){
            }
            if( !name || !name){
                var error = { 
                    code: 400, 
                    message: `Bad request. Provide a valid action name with action object example  \n   
                    { 
                        "jsonrpc": "2.0", 
                        "id":"1",
                        "method":"getActionParams", 
                        "params": 
                        {
                            "name": {{action name}}
                            "object" : {{action object}}
                        } 
                    }`
                };
                return callback(error); // will return the error object as given
            }
            if (!contract) {
                var error = { code: 404, message: 'Cannot find chain id ' + args.id };
                return callback(error); // will return the error object as given
            } else {
                return callback(null, contract.performAction(req.param.chainId));
            }
        }
    }
    //register post contract rout for json rpc protocol 
    app.post('/contracts',
        bodyParser.json(),
        bodyParser.urlencoded({
            extended: true

    const server = app.listen(4000, function() {
        console.log('process.env.NODE_ENV = ' + process.env.NODE_ENV);
        console.log('Example app listening at http://%s:%s', server.address().address, server.address().port);
        console.log('environment mode ' + app.get('env'));
    });
}())