'use strict'
import Engine from 'ratatoskr/ratlib/exeng'
import MemoryConsensus from 'ratatoskr/ratlib/consensus/memory'
import MCStoreMailbox from './mcsmailbox'

export function dummyConfig (params) {
  if (params === undefined) params = {}
  let consensusEngine = params.consensusEngine || new MemoryConsensus
  let executionEngine = params.executionEngien || new Engine
  return {
    ratatosk: {
      consensusEngine: consensusEngine,
      executionEngine: executionEngine
    },
    mailbox: new MCStoreMailbox(consensusEngine)
  }
}
