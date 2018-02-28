/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE 
 */

'use strict'
export default class InvitationManager {
  constructor (context, mailbox) {
    this._context = context
    this._mailbox = mailbox
  }

  async invite (contractInstance, party) {
    await this._mailbox.sendMessage(party, {
      type: 'invite',
      sender: this._context.principalIdentity.getID(),
      chainID: contractInstance.getChainID(),
      sessionKey: contractInstance.sessionKey
    })
  }

  async processInviteMessage (message) {
    await this._context.contractInstanceManager.joinContractInstance(message.chainID,
      {sessionKey: message.sessionKey})
  }

}
