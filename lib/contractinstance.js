import EventEmitter from 'events'
import {encodeParameters} from './util';
import crypto from 'crypto';

class MultiSigState {
    constructor () {
        this.reset();
    }
    reset () {
        this.proposal = null;
        this.action = null;
        this.initiated = false;
        this.coordinator = null;
        this.submitted = false;
    }

    isActive() {
        return this.proposal !== null;
    }
}

export default class ContractInstance {

    constructor(context) {
        this._context = context;
        this._initialized = false;
        this.contractDefinition = null;
        this.cryptor = null;
        this.events = new EventEmitter();

        this.multiSigState = new MultiSigState();
    }

  initializeExisting (chainID, metaData) {
    const rat = this._context._ratatosk;
    this.sessionKey = metaData.sessionKey || null;
    this.cryptor = rat.executionEngine.makeCryptor(this.sessionKey);
    return rat.executionEngine.loadContractInstance(
        chainID,
        rat.consensusEngine,
        this.cryptor
    ).then( inst => {
        this._inst = inst;
        this.contractDefinition = this._context.contractDefinitionManager.getByContractHash(
            this._inst.contractDefinition.contractHash
        );
        if (!this.contractDefinition) throw Error("contract definition not found");
        this._initialized = true;
        this._setupEventHandler();
        return this.sync();
    })
  }

  async initializeNew (contractDefinition, parameters) {
    const initAction = contractDefinition._def.actions['$INIT'];
    const rat = this._context._ratatosk;
    this.sessionKey = (this._context.useEncryption) ? crypto.randomBytes(32) : null;
    this.cryptor = rat.executionEngine.makeCryptor(this.sessionKey);
    this._inst = await rat.executionEngine.makeNewContractInstance(
        contractDefinition._def,
        encodeParameters(parameters, initAction.parameters),
        rat.consensusEngine,
        this.cryptor
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

  getFieldInfo() {
    return this.contractDefinition.getFieldInfo();
  }

  getMessageChain () {
        return this._inst.messageChain;
  }

  getLastUpdateTime() {
        return this._inst.lastUpdate;
  }

  hasSyncErrors() {
        return this._inst.syncError;
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

  getMetaData () { return {sessionKey: this.sessionKey} }

  sync () {
    return this._inst.sync()
  }

  async handleMultiSig (message) {
      if (message.type === 'multi-sig-proposal') {
          const rat = this._context._ratatosk;
          const principalIdentity = this._context.principalIdentity;
          const keyPair = principalIdentity.getRawKeyPair();

          const proposal = rat.executionEngine.decodeMessageProposal(message.proposal);
          const lm = rat.executionEngine.decodeMessage(proposal.rawMessage, this.cryptor.decryptor);

          this.multiSigState.proposal = proposal;
          this.multiSigState.action = lm.action;
          this.multiSigState.initiated = false;
          this.multiSigState.coordinator = message.sender;

          console.log("Got a proposal to sign");
      } else if (message.type === 'multi-sig-sig') {
          if (! (this.multiSigState.isActive() && this.multiSigState.initiated))
              return;
          this.multiSigState.proposal.applySignature(message.signature);
          if (this.multiSigState.proposal.isFullySigned()) {
              console.log("Proposal is fully signed. Submitting it!");
              await this._context._ratatosk.consensusEngine.postMessage(this.getChainID(),
                  this.multiSigState.proposal.rawMessage);
              this.multiSigState.reset();
          }
      }
  }

  checkAction(action, params) {
      if (!(action in this.contractDefinition._def.actions))
          return Error("Action not found");
      try {
          const signedBy = this._inst.currentState.getActionSigners(action);
          const actionParameters = this.contractDefinition._def.actions[action].parameters;
          params = encodeParameters(params, actionParameters);
          return this._inst.checkAction(action, params, signedBy);
      } catch (e) {
          return e;
      }
  }

  async performAction (action, params) {
      if (!this._initialized) throw Error('not initialized');
      const actionParameters = this.contractDefinition._def.actions[action].parameters;
      const principalIdentity = this._context.principalIdentity;
      const rat = this._context._ratatosk;
      const keyPair = principalIdentity.getRawKeyPair();
      const encodedParams = encodeParameters(params, actionParameters);
      const simpleSigner = rat.executionEngine.makeSimpleSigner(keyPair);

      if (this.multiSigState.isActive()) {
          if (this.multiSigState.initiated) throw Error("Already initiated");
          if (this.multiSigState.action !== action) throw Error("Multi-sig is in progress"); // TODO allow to cancel
          const signature = await this.multiSigState.proposal.sign(keyPair.pubKey, simpleSigner);
          await this._context._mailbox.sendMessage(
              this.multiSigState.coordinator, {
                  type: "multi-sig-sig",
                  sender: principalIdentity.getID(),
                  chainID: this.getChainID(),
                  signature: signature
              }
          );
          this.multiSigState.submitted = true;
          return;
      }

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
          this.multiSigState.proposal = proposal;
          this.multiSigState.action = action;
          this.multiSigState.initiated = true;
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
