/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE 
 */

'use strict'
export default class MCStoreMailbox {
  constructor (connector) {
    this._connector = connector
  }

  _initialize (context) {
    this._context = context
  }

  async getNextMessage (lastMessageRef) {
    const chainID = this._context.principalIdentity.getID()
    const messages = await this._connector.getMessages(chainID)
    const offset = lastMessageRef ? (lastMessageRef.offset + 1) : 0
    if (offset < messages.length) {
	const message = messages[offset]
	message.ref = {offset: offset}
	return message
    } else {
      return null
    }
  }

  async sendMessage (recipientID, msg) {
    await this._connector.postMessage(recipientID, msg)
  }
}
