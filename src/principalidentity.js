export default class PrincipalIdentity {
  constructor (context) {
    this._context = context
  }

  async initialize () {
    this._data = await this._context.getData('identityData')
  }

  isSetUp () {
    return this._data !== undefined
  }

  async importIdentity (data) {
    this._data = data
    await this._context.setData('identityData', data)
  }

  async generateIdentity () {
    await this.importIdentity(this._context._ratatosk.executionEngine.makeKeyPair())
  }

  getID () {
    if (!this._data) throw new Error("identity isn't set up")
    return this._data.pub
  }

  getPublicKey () {
    if (!this._data) throw new Error("identity isn't set up")
    return this._data.pub
  }

  getPrivateKey () {
    if (!this._data) throw new Error("identity isn't set up")
    return this._data.wif
  }
  

}
