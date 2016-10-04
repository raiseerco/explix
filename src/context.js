import ContractInstance from './contractinstance'
import DummyPersister from './dummypersister'
import ContractInstanceManager from './contractinstancemanager'
import ContractDefinitionManager from './contractdefinitionmanager'
import InvitationManager from './invitationmanager'
import MessageDispatcher from './messagedispatcher'

export default class EsplixContext {
  constructor (params) {
    this._ratatosk = params.ratatosk
    this.contractInstanceClass = params.contractInstanceClass || ContractInstance
    this._persister = params.persister || (new DummyPersister)
    this._mailbox = params.mailbox
    this._initialized = false
    this._initializing = false
  }

  async initialize () {
    if (this._initialized) return
    this._initializing = true

    const messageDispatcher = new MessageDispatcher(this, this._mailbox)
    await messageDispatcher._initialize()
    this._messageDispatcher = messageDispatcher
    
    this.invitationManager = new InvitationManager(this, this._mailbox)
    
    const contractDefinitionManager = new ContractDefinitionManager(this)
    await contractDefinitionManager._initialize()
    this.contractDefinitionManager = contractDefinitionManager

    const contractInstanceManager = new ContractInstanceManager(this)
    await contractInstanceManager._initialize()
    this.contractInstanceManager = contractInstanceManager

    this._initialized = true
    this._initializing = false
  }

  async getData (key) { return await this._persister.getData(key)  }
  async setData (key, value) { await this._persister.setData(key, value) }
  
}
