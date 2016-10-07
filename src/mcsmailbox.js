export default class MCStoreMailbox {
  constructor (context, connector) {
    this._context = context
    this._connector = connector
  }

  async _initialize () {}

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

  async sendMessage (msg) {
    const chainID = this._context.principalIdentity.getID()
    await this._connector.postMessage(chainID, msg)
  }
}
