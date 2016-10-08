import Engine from 'ratatoskr/ratlib/exeng'
import MemoryConsensus from 'ratatoskr/ratlib/consensus/memory'
import MCStoreMailbox from './mcsmailbox'

export function dummyConfig (params) {
  if (params === undefined) params = {}
  let consensusEngine = params.consensusEngine || new MemoryConsensus 
  return {
    ratatosk: {
      consensusEngine: consensusEngine,
      executionEngine: new Engine
    },
    mailbox: new MCStoreMailbox(consensusEngine)
  }
}
