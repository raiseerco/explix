/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE 
 */

'use strict'
export default class MessageDispatcher {
  constructor (context, mailbox) {
    this._context = context
    this._mailbox = mailbox
    this._lastMessageRef = null
  }

  async _initialize () {
    this._lastMessageRef = await this._context.getData("lastMessageRef")
  }

  async _processMultiSig(message) {
    const instman = this._context.contractInstanceManager;
    const instance = instman.getInstanceByChainID(message.chainID);
    if (!instance) {
      console.log("Skipping weird multi-sig invitation");
    } else {
      await instance.handleMultiSig(message);
    }
  }

  async _process (message) {
    switch (message.type) {
        case "invite":
          await this._context.invitationManager.processInviteMessage(message);
          break;
        case "multi-sig-sig":
        case "multi-sig-proposal":
          await this._processMultiSig(message);
          break;
    }
  }

  async _update1 () {
    const message = await this._mailbox.getNextMessage(this._lastMessageRef)
    if (message) {
      await this._process(message)      
      await this._context.setData("lastMessageRef", message.ref)
      this._lastMessageRef = message.ref
      return true
    } else {
      return false
    }
  }

  async update () {
    let hadUpdate = false
    while (await this._update1()) {
      hadUpdate = true
    }
    return hadUpdate
  }

}
