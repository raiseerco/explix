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

  async _process (message) {
    switch (message.type) {
      case "invite":
      await this._context.invitationManager.processInviteMessage(message)
      break
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
