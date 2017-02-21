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

        t.equals(typeof client.sender.send, 'function', 'should have the send function');
        t.end();
    }).catch(err => {
        t.fail(err);
        t.end();
    });
});

test('test senderClient url with trailing slash', (t) => {
    const settings = {
        url: 'http://localhost:8080/ag-push/',
        applicationId: '54321',
        masterSecret: 'secret'
    };

    agSender(settings).then((client) => {
        t.equal(client.url, 'http://localhost:8080/ag-push/rest/sender/', 'client should have a url value of settings.url');
        t.end();
    }).catch(err => {
        t.fail(err);
        t.end();
    });
});

test('test senderClient should reject when no settings', (t) => {
    agSender().catch((err) => {
        t.assert(err.toString().includes('settings must contain valid url, applicationId, and masterSecret'), 'should return a promise rejection when missing the applicationId');
        t.end();
    });
});

test('test senderClient should reject when applicationId setting', (t) => {
    const settings = {
        url: 'http://localhost:8080/ag-push',
        masterSecret: 'secret'
    };

    agSender(settings).catch((err) => {
        t.assert(err.toString().includes('settings must contain valid url, applicationId, and masterSecret'), 'should return a promise rejection when missing the applicationId');
        t.end();
    });
});

test('test senderClient should reject when masterSecret setting', (t) => {
    const settings = {
        url: 'http://localhost:8080/ag-push',
        applicationId: '54321'
    };

    agSender(settings).catch((err) => {
        t.assert(err.toString().includes('settings must contain valid url, applicationId, and masterSecret'), 'should return a promise rejection when missing the masterSecert');
        t.end();
    });
});

test('test senderClient should reject when url setting', (t) => {
    const settings = {
        applicationId: '54321',
        masterSecret: 'secret'
    };

    agSender(settings).catch((err) => {
        t.assert(err.toString().includes('settings must contain valid url, applicationId, and masterSecret'), 'should return a promise rejection when missing the url');
        t.end();
    });
});
