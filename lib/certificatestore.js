/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE 
 */

import {postchainQuery} from './util';

export default class CertificateStore {
    constructor (context) {
        this.context = context;
        this.authority = undefined;
    }

    getCertificates (id) {
        return postchainQuery(this.context.postchainClient,
            "get_certificates", {id: id, authority: this.authority}
        );
    }
}