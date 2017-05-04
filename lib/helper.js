import {DefaultEngine, consensus, GTXMessageCodec} from 'ratatosk2';
import {DummyMailboxManager, DummyMailbox} from './dummymailbox';

//import OldMemoryConsensus from 'ratatoskr/ratlib/consensus/memory'
import MCStoreMailbox from './mcsmailbox'
import MCStore from './mcstore'

export function postchainConfig(postchainURL, messagingURL) {
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
    //let commEngine = new OldMemoryConsensus();
    let consensusEngine = params.consensusEngine || new consensus.Memory();
    let executionEngine = params.executionEngine || new DefaultEngine(new GTXMessageCodec());
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
