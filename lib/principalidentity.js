/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE 
 */

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
    constructor(context) {
        this._context = context;
    }

    async initialize() {
        this._identityData = await this._context.getData('identityData');
        if (this._identityData)
            this._keyPair = decodeKeyPair(this._identityData);
    }

    _saveIdentityData() {
        return this._context.setData('identityData', this._identityData);
    }

    getAttribute(key) {
        return this._identityData['attributes'][key];
    }

    async setAttribute(key, value) {
        if (!('attributes' in this._identityData))
            this._identityData['attributes'] = {};
        this._identityData['attributes'][key] = value;
        await this._saveIdentityData();
    }

    getCertificate() {
        return this._identityData['certificate'];
    }

    async setCertificate(certificate) {
        this._identityData['certificate'] = certificate;
        await this._saveIdentityData();
    }

    isSetUp() {
        return this._keyPair !== undefined
    }

    async importIdentity(encodedKeyPair) {
        this._identityData = encodedKeyPair;
        this._keyPair = decodeKeyPair(encodedKeyPair);
        await this._saveIdentityData();
    }

    async importIdentityFromPrivateKey(privKey) {
        const pubKey = await this.generatePubKey(privKey);
        await this.importIdentity(encodeKeyPair({ privKey, pubKey }))
    }

    async generatePubKey(privateKey) {
        const cryptoSystem = this._context._ratatosk.executionEngine.cryptoSystem;
        const pubKey = cryptoSystem.generatePubKey(privateKey);

        if (!pubKey) throw new Error("Not possible to generate public key");
        return pubKey;
    }

    async generateIdentity(entropy) {
        const cryptoSystem = this._context._ratatosk.executionEngine.cryptoSystem;
        this._keyPair = cryptoSystem.makeKeyPair(entropy);
        this._identityData = encodeKeyPair(this._keyPair);
        await this._context.setData("identityData", this._identityData);
    }

    getRawKeyPair() {
        if (!this._identityData) throw new Error("identity isn't set up");
        return this._keyPair;
    }

    getKeyPair() {
        if (!this._identityData) throw new Error("identity isn't set up");
        return this._identityData;
    }


    getID() {
        if (!this._identityData) throw new Error("identity isn't set up")
        return this._identityData.pubKey
    }

    getPublicKey() {
        if (!this._identityData) throw new Error("identity isn't set up")
        return this._identityData.pubKey
    }

    getPrivateKey() {
        if (!this._identityData) throw new Error("identity isn't set up")
        return this._identityData.privKey
    }


}
