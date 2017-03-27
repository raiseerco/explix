import {DefaultEngine, consensus, GTXMessageCodec} from 'ratatosk2';
import {DummyMailboxManager, DummyMailbox} from './dummymailbox';
//import OldMemoryConsensus from 'ratatoskr/ratlib/consensus/memory'
//import MCStoreMailbox from './mcsmailbox'

export function dummyConfig(params) {
    if (params === undefined) params = {};
    //let commEngine = new OldMemoryConsensus();
    let consensusEngine = params.consensusEngine || new consensus.memory();
    let executionEngine = params.executionEngine || new DefaultEngine(new GTXMessageCodec());
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
        mailbox: mailbox
    }
}
