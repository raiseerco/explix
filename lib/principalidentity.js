function encodeKeyPair(kp) {
  return {
      pubKey: kp.pubKey.toString('hex'),
      privKey: kp.privKey.toString('hex')
  }
}

function decodeKeyPair(kp) {
    return {
        pubKey: Buffer.from(kp.pubKey, 'hex'),
        privKey: Buffer.from(kp.privKey, 'hex')
    }
}


export default class PrincipalIdentity {
  constructor (context) {
    this._context = context
  }

  async initialize () {
      this._encodedKeyPair = await this._context.getData('identityData');
      if (this._encodedKeyPair)
        this._keyPair = decodeKeyPair(this._encodedKeyPair);
  }

  isSetUp () {
    return this._keyPair !== undefined
  }

  async importIdentity (encodedKeyPair) {
    this._encodedKeyPair = encodedKeyPair;
    this._keyPair = decodeKeyPair(encodedKeyPair);
    await this._context.setData('identityData', encodedKeyPair);
  }

  async generateIdentity (entropy) {
    const cryptoSystem = this._context._ratatosk.executionEngine.cryptoSystem;
    this._keyPair = cryptoSystem.makeKeyPair(entropy);
    this._encodedKeyPair = encodeKeyPair(this._keyPair);
    await this._context.setData("identityData", this._encodedKeyPair);
  }

  getRawKeyPair() {
      if (!this._encodedKeyPair) throw new Error("identity isn't set up");
      return this._keyPair;
  }

  getKeyPair() {
      if (!this._encodedKeyPair) throw new Error("identity isn't set up");
      return this._encodedKeyPair;
  }


  getID () {
      if (!this._encodedKeyPair) throw new Error("identity isn't set up")
    return this._encodedKeyPair.pubKey
  }

  getPublicKey () {
    if (!this._encodedKeyPair) throw new Error("identity isn't set up")
    return this._encodedKeyPair.pubKey
  }

  getPrivateKey () {
    if (!this._encodedKeyPair) throw new Error("identity isn't set up")
    return this._encodedKeyPair.privKey
  }
  

}
