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