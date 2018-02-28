/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE 
 */

import _ from 'lodash';

export class DummyMailboxManager {
    constructor () {
        this.mailboxes = {};
    }

    sendMessage(recipient, message) {
        let mailbox;
        if (!(recipient in this.mailboxes)) {
            mailbox = [];
            this.mailboxes[recipient] = mailbox;
        } else mailbox = this.mailboxes[recipient];

        message = _.cloneDeep(message);
        message.ref = {offset: mailbox.length};
        mailbox.push(message);
    }

    getMessage(recipient, offset) {
        if (recipient in this.mailboxes) {
            const mailbox = this.mailboxes[recipient];
            if (mailbox.length > offset)
                return mailbox[offset];
            else
                return null;
        } else return null;
    }
}


export class DummyMailbox {

    constructor(manager) {
        this.manager = manager
    }

    async _initialize(context) {
        this.principalIdentity = context.principalIdentity;
    }

    async getNextMessage(ref) {
        const offset = (ref) ? (ref.offset+1) : 0;
        return this.manager.getMessage(this.principalIdentity.getID(), offset);
    }

    async sendMessage(recipient, message) {
        console.log("sendMessage", message);
        this.manager.sendMessage(recipient, message);
    }

}
