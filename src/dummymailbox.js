export default class DummyMailbox {

  constructor () {
  }

  async getNextMessage (cookie) { return null }
  async sendMessage (message) {} 

}
