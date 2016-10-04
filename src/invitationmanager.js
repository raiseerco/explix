export default class InvitationManager {
  constructor (context, mailbox) {
    this._context = context
    this._mailbox = mailbox
  }

  async invite (party, chainID) {
    await this._mailbox.sendMessage({
      type: 'invite',
      recipient: party,
      chainID: chainID
    })
  }

  async processInvitEMessage (message) {
    await this._context.contractInstanceManager.joinContractInstance(message.chainID)
  }
  
}
