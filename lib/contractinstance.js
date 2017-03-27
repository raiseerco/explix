import MessageChainController from 'ratatoskr/ratlib/controller'
import EventEmitter from 'events'
import {encodeParameters} from './util';

export default class ContractInstance {
  
  constructor (context) {
    this._context = context
    this._initialized = false
    this.contractDefinition = null
    this.events = new EventEmitter()
  }

  initializeExisting (chainID) {
    const rat = this._context._ratatosk;
    return rat.executionEngine.loadContractInstance(
        chainID,
        rat.consensusEngine,
        rat.executionEngine.makeCryptor(null)
    ).then( inst => {
        this._inst = inst;
        this.contractDefinition = this._context.contractDefinitionManager.getByContractHash(
            this._inst.contractDefinition.contractHash
        );
        if (!this.contractDefinition) throw Error("contract definition not found");
        this._initialized = true;
        this._setupEventHandler();
    })
  }

  async initializeNew (contractDefinition, parameters) {
    const initAction = contractDefinition._def.actions['$INIT'];
    const rat = this._context._ratatosk;

    this._inst = await rat.executionEngine.makeNewContractInstance(
        contractDefinition._def,
        encodeParameters(parameters, initAction.parameters),
        rat.consensusEngine,
        rat.executionEngine.makeCryptor(null)
    );
    this._initialized = true;
    this.contractDefinition = contractDefinition;
    this._setupEventHandler()
  }

  _setupEventHandler () {
    this._inst.events.on("message", () => {
      this.events.emit("message")
    })
  }

  getFields() {
    return this._inst.currentState.getFieldValues(true)
  } 
  
  getApplicableActions( pubkeys ){
    if (pubkeys === undefined)
      pubkeys = [this._context.principalIdentity.getRawKeyPair().pubKey];
    return this._inst.currentState.getApplicableActions( pubkeys );
  } 

  getActionParams(actionName) {
     return this.contractDefinition.getActionParams(actionName);
  }

  getChainID () {
    if (!this._initialized) throw Error('not initialized');
    return this._inst.chainID
  }

  getMetaData () { return {} }

  sync () {
    return this._inst.sync()
  }

  async handleMultiSig (message) {
      if (message.type === 'multi-sig-proposal') {
          const rat = this._context._ratatosk;
          const principalIdentity = this._context.principalIdentity;
          const keyPair = principalIdentity.getRawKeyPair();
          const simpleSigner = rat.executionEngine.makeSimpleSigner(keyPair);

          const proposal = rat.executionEngine.decodeMessageProposal(message.proposal);
          console.log("Automatically. signing. proposal. WHY???");
          const signature = await proposal.sign(keyPair.pubKey, simpleSigner);
          this._context._mailbox.sendMessage(
              message.sender, {
                  type: "multi-sig-sig",
                  sender: principalIdentity.getID(),
                  chainID: this.getChainID(),
                  signature: signature
              }
          );
      } else if (message.type === 'multi-sig-sig') {
          if (!this.pendingMSProposal) return;
          this.pendingMSProposal.applySignature(message.signature);
          if (this.pendingMSProposal.isFullySigned()) {
              console.log("Proposal is fully signed. Submitting it!")
              await this._context._ratatosk.consensusEngine.postMessage(this.getChainID(),
                  this.pendingMSProposal.rawMessage);
              this.pendingMSProposal = null;
          }
      }
  }

  async performAction (action, params) {
      if (!this._initialized) throw Error('not initialized');
      if (this.pendingMSProposal) throw Error("There is a pending message");
      // TODO: cleanup pending message ?
      const actionParameters = this.contractDefinition._def.actions[action].parameters;
      const principalIdentity = this._context.principalIdentity;
      const rat = this._context._ratatosk;
      const keyPair = principalIdentity.getRawKeyPair();
      const encodedParams = encodeParameters(params, actionParameters);
      const simpleSigner = rat.executionEngine.makeSimpleSigner(keyPair);

      const signers = this._inst.currentState.getActionSigners(action);
      if (signers === null) throw Error("This action cannot be performed");

      if (signers.length === 1) {
          if (!keyPair.pubKey.equals(signers[0])) throw Error("Somehow action should be signed by somebody else...");

          await this.contractDefinition.beforeAction(this, action, params);

          return await this._inst.performAction(
              action,
              encodedParams,
              signers,
              simpleSigner
          );
      } else {
          // multi-sig
          const message = this._inst.makeMessage(action, encodedParams, signers);
          const proposalBuffer = rat.executionEngine.encodeMessageProposal(this.getChainID(), message);
          const proposal = rat.executionEngine.decodeMessageProposal(proposalBuffer);
          proposal.applySignature(await proposal.sign(
              keyPair.pubKey, simpleSigner
          ));
          this.pendingMSProposal = proposal;
          for (const signer of signers) {
              if (signer.equals(keyPair.pubKey)) continue;
              this._context._mailbox.sendMessage(
                  signer.toString('hex'), {
                      type: "multi-sig-proposal",
                      chainID: this.getChainID(),
                      sender: principalIdentity.getID(),
                      proposal: proposalBuffer
                  }
              );
          }
      }



  }
  
}
