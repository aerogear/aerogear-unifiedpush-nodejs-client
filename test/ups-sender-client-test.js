'use strict';

const test = require('tape');
const agSender = require('../');

test('test senderClient should return a Promise with the client object', (t) => {
    const settings = {
        url: 'http://localhost:8080/ag-push',
        applicationId: '54321',
        masterSecret: 'secret'
    };

    const upsSenderClient = agSender(settings);
    t.equal(upsSenderClient instanceof Promise, true, 'should return a promise');

    upsSenderClient.then((client) => {
        t.equal(typeof client.url, 'string', 'client should have a url String');
        t.equal(client.url, 'http://localhost:8080/ag-push/rest/sender/', 'client should have a url value of settings.url');
        t.end();
    });
});
