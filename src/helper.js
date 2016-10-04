import Engine from 'ratatoskr/ratlib/exeng'
import NullConsensus from 'ratatoskr/ratlib/consensus/null'
import DummyMailbox from './dummymailbox'

export function dummyConfig (params) {
  return {
    ratatosk: {
      consensusEngine: new NullConsensus,
      executionEngine: new Engine
    },
    mailbox: new DummyMailbox
  }
}
