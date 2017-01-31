'use strict'
import ContractInstance from './contractinstance'
import DummyPersister from './dummypersister'
import ContractInstanceManager from './contractinstancemanager'
import ContractDefinitionManager from './contractdefinitionmanager'
import InvitationManager from './invitationmanager'
import MessageDispatcher from './messagedispatcher'
import PrincipalIdentity from './principalidentity'
import MCStoreMailbox from './mcsmailbox'

export default class EsplixContext {
    constructor(params) {
        this._ratatosk = params.ratatosk
        this.contractInstanceClass = params.contractInstanceClass || ContractInstance
        this._persister = params.persister || (new DummyPersister)
        let mailbox = params.mailbox
        if (!mailbox) {
            if (this._ratatosk.consensusEngine.constructor.name === 'MCStoreConnector') {
                mailbox = new MCStoreMailbox(this._ratatosk.consensusEngine)
            }
        }
        if (!mailbox) throw Error("No mailbox was provided")
        this._mailbox = mailbox

        this._defaultContractDefinitions = params._defaultContractDefinitions
      
        this._initialized = false
        this._initializing = false      
    }

    async initialize() {
        if (this._initialized) return
        this._initializing = true

        const principalIdentity = new PrincipalIdentity(this)
        await principalIdentity.initialize()
        this.principalIdentity = principalIdentity

        await this._mailbox._initialize(this)

        const messageDispatcher = new MessageDispatcher(this, this._mailbox)
        await messageDispatcher._initialize()
        this._messageDispatcher = messageDispatcher

        this.invitationManager = new InvitationManager(this, this._mailbox)

        const contractDefinitionManager = new ContractDefinitionManager(this)
        await contractDefinitionManager._initialize(this._defaultContractDefinitions)
        this.contractDefinitionManager = contractDefinitionManager

        const contractInstanceManager = new ContractInstanceManager(this)
        await contractInstanceManager._initialize()
        this.contractInstanceManager = contractInstanceManager

        this._initialized = true
        this._initializing = false
    }

  async update () {
    await this._messageDispatcher.update();
    await this.contractInstanceManager.sync();
  }
  
    async getData(key) {
       return await this._persister.getData(key)
    }
    async setData(key, value) {
        await this._persister.setData(key, value)
    }

}
