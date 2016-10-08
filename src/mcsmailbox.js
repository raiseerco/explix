export default class MCStoreMailbox {
  constructor (connector) {
    this._connector = connector
  }

  async _initialize (context) {
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
