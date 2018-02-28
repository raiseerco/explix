/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE 
 */

import {postchainQuery} from './util';

export default class CertificateStore {
    constructor (context) {
        this.context = context;
        this.authority = null;
    }

    getCertificates (id) {
        return postchainQuery(this.context.postchainClient,
            "getCertificates", {id: id, authority: this.authority}
        );
    }
}