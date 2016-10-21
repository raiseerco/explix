'use strict'
export default class DummyMailbox {

  constructor () {
  }

  async _initialize () {}
  
  async getNextMessage (cookie) { return null }
  async sendMessage (recipient, message) {
    console.log("sendMessage", message)
  } 

}
