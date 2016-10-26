'use strict'
import express from 'express';
import path from 'path';
import jayson from 'jayson';

import ContractInstance from '../lib/contractinstance'
import { dummyConfig } from '../lib/helper'
import Context from '../lib/context'
import dummyContract from '../test/dummy.ratc'
import bodyParser from 'body-parser'

const app = express()
const api = express.Router()


;(async function() {
    /*Initialize context here*/
    async function dummyContext(configParams) {
        const context = new Context(dummyConfig(configParams))
        await context.initialize()
        context.contractDefinitionManager.registerDefinition(dummyContract)
        return context;
    }
    const context = await dummyContext();
    const dummyContractHash = '11111111111111111'
    await context.principalIdentity.generateIdentity()
    const contractInstance = await context.contractInstanceManager.createContractInstance(
        context.contractDefinitionManager.getByContractHash(dummyContractHash), { owner: context.principalIdentity.getPublicKey() }
    )


    /*request example
              {   
                  "jsonrpc": "2.0", 
                  "id":"1",
                  "method":"getContractIds"
              }
          */
    async function getContractIds(args, callback) {
        const contracts = await context.contractInstanceManager.getContractInstances()
        const contractIds = contracts.map(el => el.getChainID())
        callback(null, contractIds)
    }

    /*request example
       {"jsonrpc": "2.0", 
        "id":"1",
        "method":"getFields", 
        "params": {"id": {{contract id}}} }
    */
    async function getFields(args, callback) {
        const contract = await context.contractInstanceManager.getInstanceByChainID(args.id)

        if (!contract) {
            var error = { code: 404, message: 'Cannot find chain id ' + args.id }
            callback(error) // will return the error object as given
        } else {
            return callback(null, contract.getFields())
        }
    }

    /*request example
    {   "jsonrpc": "2.0", 
        "id":"1",
        "method":"getActions", 
        "params": {"id": {{contract id}}} }
    */
    async function getActions(args, callback) {
        const contract = await context.contractInstanceManager.getInstanceByChainID(args.id);

        if (!contract) {
            var error = { code: 404, message: 'Cannot find chain id ' + args.id }
            callback(error) // will return the error object as given
        } else {
            return callback(null, contract.getApplicableActions())
        }

    }

    /*request example
    {   "jsonrpc": "2.0", 
        "id":"1",
        "method":"getActionParams", 
        "params": {"id": {{contract id}}} }
    */
    async function getActionParams(args, callback) {
        const contract = await context.contractInstanceManager.getInstanceByChainID(args.id);

        if (!contract) {
            var error = { code: 404, message: 'Cannot find chain id ' + args.id }
            callback(error) // will return the error object as given
        } else {
            const result = contract.getActionParams()
            return callback(null, result);
        }
    }


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
    async function performAction(args, callback) {
        const contract = await context.contractInstanceManager.getInstanceByChainID(args.id)
        const name = args.name
        try {
            const object = JSON.parse()
        } catch (err) {}
        if (!name || !object) {
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
            var error = { code: 404, message: 'Cannot find chain id ' + args.id }
            return callback(error); // will return the error object as given
        }
        return callback(null, contract.performAction(name, object))
    }

    //requests path POST '/contracts'
    const contracts =
        //register post contract rout for json rpc protocol 
        app.post('/contracts',
            bodyParser.json(),
            bodyParser.urlencoded({
                extended: true
            }),
            jayson.server({
                getContractIds,
                getFields,
                getActions,
                getActionParams,
                performAction
            }).middleware()
        )

    app.use(function(err, req, res, next) {
        if (!err || err.status == 404) return next() // you also need this line
        console.error(err.stack)
        console.log(err)
        res.status(500).send(err)
    })


    const server = app.listen(4000, function() {
        console.log('process.env.NODE_ENV = ' + process.env.NODE_ENV)
        console.log('Example app listening at http://%s:%s', server.address().address, server.address().port)
        console.log('environment mode ' + app.get('env'))
    })
}())
