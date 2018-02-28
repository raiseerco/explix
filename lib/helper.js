/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE 
 */

import {DefaultEngine, consensus, GTXMessageCodec} from 'ratatosk';
import {DummyMailboxManager, DummyMailbox} from './dummymailbox';

import MCStoreMailbox from './mcsmailbox'
import MCStore from './mcstore'

export function postchainConfig (postchainURL, messagingURL, blockchainRID) {
    if (!blockchainRID)
        throw Erro("blockchainRID parameter is missing");
    const consensusEngine =  new consensus.Postchain(postchainURL);
    return {
        ratatosk: {
            executionEngine: new DefaultEngine(new GTXMessageCodec()),
            consensusEngine: consensusEngine
        },
        mailbox: new MCStoreMailbox(new MCStore(messagingURL)),
        postchainClient: consensusEngine.restClient
    }
}

export function dummyConfig(params) {
    if (params === undefined) params = {};

    const blockchainRID = params.blockchainRID || Buffer.alloc(32, 'a');
    let consensusEngine = params.consensusEngine || new consensus.Memory();
    let executionEngine = params.executionEngine || new DefaultEngine(new GTXMessageCodec(blockchainRID));
    let postchainClient = null;

    if (consensusEngine.gtxClient) {
        // postchainClient is only available with Postchain GTX consensus engine
        postchainClient = consensusEngine.restClient
    }

    let mailbox = params.mailbox;
    if (!mailbox) {
        let mbm  = params.mailboxManager || new DummyMailboxManager();
        mailbox = new DummyMailbox(mbm)
    }
    return {
        ratatosk: {
            consensusEngine: consensusEngine,
            executionEngine: executionEngine
        },
        mailbox: mailbox,
        postchainClient: postchainClient
    }
}
