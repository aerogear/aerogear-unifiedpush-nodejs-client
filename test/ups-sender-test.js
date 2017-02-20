'use strict';

const test = require('tape');
const nock = require('nock');
const agSender = require('../');

const sender = () => {
    const settings = {
        url: 'http://localhost:8080/ag-push',
        applicationId: '54321',
        masterSecret: 'secret'
    };

    return agSender(settings);
};

test('test send success', (t) => {

    nock('http://localhost:8080')
        .matchHeader('Accept', 'application/json')
        .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
        .matchHeader('Content-type', 'application/json')
        .post('/ag-push/rest/sender/')
        .reply(202, {});

    sender().then((client) => {
        client.sender.send({}, {}).then(() => {
            t.pass('response is ok');
            t.end();
        });
    });
});

test('test send success - no options', (t) => {
    nock('http://localhost:8080')
        .matchHeader('Accept', 'application/json')
        .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
        .matchHeader('Content-type', 'application/json')
        .post('/ag-push/rest/sender/')
        .reply(202, {});

    sender().then((client) => {
        client.sender.send({}).then(() => {
            t.pass('response is ok');
            t.end();
        });
    });
});

test('test send failure with non 202 response', (t) => {
    nock('http://localhost:8080')
        .matchHeader('Accept', 'application/json')
        .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
        .matchHeader('Content-type', 'application/json')
        .post('/ag-push/rest/sender/')
        .reply(400);

    sender().then((client) => {
        client.sender.send({}, {}).catch((err) => {
            t.assert(err instanceof Error);
            t.assert(err.toString().includes('UPS request returned status code: 400'));
            t.pass('should be in the catch');
            t.end();
        });
    });
});

test('test send failure such as connection refused', (t) => {
    nock('http://localhost:8080')
        .matchHeader('Accept', 'application/json')
        .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
        .matchHeader('Content-type', 'application/json')
        .post('/ag-push/rest/sender/')
        .replyWithError(new Error('ECONNREFUSED'));

    sender().then((client) => {
        client.sender.send({}, {}).catch((err) => {
            t.assert(err instanceof Error);
            t.assert(err.toString().includes('Problem with UPS Request: ECONNREFUSED'));
            t.pass('should be in the catch');
            t.end();
        });
    });
});

test('test proper message constructed - success', (t) => {
    nock('http://localhost:8080')
        .matchHeader('Accept', 'application/json')
        .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
        .matchHeader('Content-type', 'application/json')
        .post('/ag-push/rest/sender/', {
            message: {
                alert: 'Hi',
                sound: 'default',
                title: 'Title',
                action: 'Action',
                badge: 2
            }
        })
        .reply(202, {});

    const message = {
        alert: 'Hi',
        title: 'Title',
        action: 'Action',
        sound: 'default',
        badge: 2
    };

    sender().then((client) => {
        client.sender.send(message).then(() => {
            t.pass('should be ok');
            t.end();
        });
    });
});

test('test message construction for actionCategory and contentAvailable', (t) => {
    nock('http://localhost:8080')
        .matchHeader('Accept', 'application/json')
        .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
        .matchHeader('Content-type', 'application/json')
        .post('/ag-push/rest/sender/', {
            message: {
                alert: 'Hi',
                sound: 'default',
                badge: 2,
                apns: {
                    'action-category': 'action',
                    'content-available': true
                }
            }
        })
        .reply(202, {});

    const message = {
        alert: 'Hi',
        sound: 'default',
        badge: 2,
        apns: {
            actionCategory: 'action',
            contentAvailable: true
        }
    };

    sender().then((client) => {
        client.sender.send(message).then(() => {
            t.pass('should be ok');
            t.end();
        });
    });
});

test('send should be called with success with a proper message constructed for urlArgs', (t) => {
    nock('http://localhost:8080')
        .matchHeader('Accept', 'application/json')
        .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
        .matchHeader('Content-type', 'application/json')
        .post('/ag-push/rest/sender/', {
            message: {
                alert: 'Hi',
                sound: 'default',
                badge: 2,
                apns: {
                    'url-args': ['arg1', 'arg2']
                }
            }
        })
        .reply(202, {});

    const message = {
        alert: 'Hi',
        sound: 'default',
        badge: 2,
        apns: {
            urlArgs: ['arg1', 'arg2']
        }
    };

    sender().then((client) => {
        client.sender.send(message).then(() => {
            t.pass('should be ok');
            t.end();
        });
    });
});

test('send should be called with success with a proper message constructed for titleLocKey and titleLocArgs', (t) => {
    nock('http://localhost:8080')
        .matchHeader('Accept', 'application/json')
        .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
        .matchHeader('Content-type', 'application/json')
        .post('/ag-push/rest/sender/', {
            message: {
                alert: 'Hi',
                sound: 'default',
                badge: 2,
                apns: {
                    'title-loc-key': 'value',
                    'title-loc-args': ['arg1', 'arg2']
                }
            }
        })
        .reply(202, {});

    const message = {
        alert: 'Hi',
        sound: 'default',
        badge: 2,
        apns: {
            titleLocKey: 'value',
            titleLocArgs: ['arg1', 'arg2']
        }
    };

    sender().then((client) => {
        client.sender.send(message).then(() => {
            t.pass('should be ok');
            t.end();
        });
    });
});

test('send should be called with success with a proper message constructed for simplePush', (t) => {
    nock('http://localhost:8080')
        .matchHeader('Accept', 'application/json')
        .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
        .matchHeader('Content-type', 'application/json')
        .post('/ag-push/rest/sender/', {
            message: {
                alert: 'Hi',
                sound: 'default',
                badge: 2,
                'simple-push': 'version=1'
            }
        })
        .reply(202, {});

    const message = {
        alert: 'Hi',
        sound: 'default',
        badge: 2,
        simplePush: 'version=1'
    };

    sender().then((client) => {
        client.sender.send(message).then(() => {
            t.pass('should be ok');
            t.end();
        });
    });
});

test('send should be called with success with a proper message constructed for user-data', (t) => {
    nock('http://localhost:8080')
        .matchHeader('Accept', 'application/json')
        .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
        .matchHeader('Content-type', 'application/json')
        .post('/ag-push/rest/sender/', {
            message: {
                alert: 'Hi',
                sound: 'default',
                badge: 2,
                'user-data': {
                    anotherKey: 'Key'
                }
            }
        })
        .reply(202, {});

    const message = {
        alert: 'Hi',
        sound: 'default',
        badge: 2,
        userData: {
            anotherKey: 'Key'
        }
    };

    sender().then((client) => {
        client.sender.send(message).then(() => {
            t.pass('should be ok');
            t.end();
        });
    });
});

test('send should be called with success with a proper message constructed for actionCategory and contentAvailable and not camel case windows stuff', (t) => {
    nock('http://localhost:8080')
        .matchHeader('Accept', 'application/json')
        .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
        .matchHeader('Content-type', 'application/json')
        .post('/ag-push/rest/sender/', {
            message: {
                alert: 'Hi',
                sound: 'default',
                badge: 2,
                apns: {
                    'action-category': 'action',
                    'content-available': true
                },
                windows: {
                    tileType: 'CoolBeansType'
                }
            }
        })
        .reply(202, {});

    const message = {
        alert: 'Hi',
        sound: 'default',
        badge: 2,
        apns: {
            actionCategory: 'action',
            contentAvailable: true
        },
        windows: {
            tileType: 'CoolBeansType'
        }
    };

    sender().then((client) => {
        client.sender.send(message).then(() => {
            t.pass('should be ok');
            t.end();
        });
    });
});

test('send should be called with success with a proper message with a priority added', (t) => {
    nock('http://localhost:8080')
        .matchHeader('Accept', 'application/json')
        .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
        .matchHeader('Content-type', 'application/json')
        .post('/ag-push/rest/sender/', {
            message: {
                alert: 'Hi',
                sound: 'default',
                badge: 2,
                priority: 'normal'
            }
        })
        .reply(202, {});

    const message = {
        alert: 'Hi',
        sound: 'default',
        badge: 2,
        priority: 'normal'
    };

    sender().then((client) => {
        client.sender.send(message).then(() => {
            t.pass('should be ok');
            t.end();
        });
    });
});

test('send should be called with success with a proper options constructed with a config and no criteria', (t) => {
    nock('http://localhost:8080')
        .matchHeader('Accept', 'application/json')
        .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
        .matchHeader('Content-type', 'application/json')
        .post('/ag-push/rest/sender/', {
            config: {
                ttl: 3600
            },
            message: {
                alert: 'Hi',
                sound: 'default',
                badge: 2,
                'simple-push': 'version=1'
            }
        })
        .reply(202, {});

    const message = {
        alert: 'Hi',
        sound: 'default',
        badge: 2,
        simplePush: 'version=1'
    };

    const options = {
        config: {
            ttl: 3600
        }
    };

    sender().then((client) => {
        client.sender.send(message, options).then(() => {
            t.pass('should be ok');
            t.end();
        });
    });
});

test('send should be called with success with a proper options constructed with a criteria and no config', (t) => {
    nock('http://localhost:8080')
        .matchHeader('Accept', 'application/json')
        .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
        .matchHeader('Content-type', 'application/json')
        .post('/ag-push/rest/sender/', {
            criteria: {
                variants: ['1234', '56788'],
                categories: ['category1', 'category2']
            },
            message: {
                alert: 'Hi',
                sound: 'default',
                badge: 2,
                'simple-push': 'version=1'
            }
        })
        .reply(202, {});

    const message = {
        alert: 'Hi',
        sound: 'default',
        badge: 2,
        simplePush: 'version=1'
    };

    const options = {
        criteria: {
            variants: ['1234', '56788'],
            categories: ['category1', 'category2']
        }
    };

    sender().then((client) => {
        client.sender.send(message, options).then(() => {
            t.pass('should be ok');
            t.end();
        });
    });
});

test('send should be called with success with a proper options constructed with a criteria and a config', (t) => {
    nock('http://localhost:8080')
        .matchHeader('Accept', 'application/json')
        .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
        .matchHeader('Content-type', 'application/json')
        .post('/ag-push/rest/sender/', {
            config: {
                ttl: 3600
            },
            criteria: {
                variants: ['1234', '56788'],
                categories: ['category1', 'category2']
            },
            message: {
                alert: 'Hi',
                sound: 'default',
                badge: 2,
                'simple-push': 'version=1'
            }
        })
        .reply(202, {});

    const message = {
        alert: 'Hi',
        sound: 'default',
        badge: 2,
        simplePush: 'version=1'
    };

    const options = {
        config: {
            ttl: 3600
        },
        criteria: {
            variants: ['1234', '56788'],
            categories: ['category1', 'category2']
        }
    };

    sender().then((client) => {
        client.sender.send(message, options).then(() => {
            t.pass('should be ok');
            t.end();
        });
    });
});

test('send should be called with success with a proper options constructed with a criteria and a criteria with empty array values', (t) => {
    nock('http://localhost:8080')
        .matchHeader('Accept', 'application/json')
        .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
        .matchHeader('Content-type', 'application/json')
        .post('/ag-push/rest/sender/', {
            criteria: {
            },
            message: {
                alert: 'Hi'
            }
        })
        .reply(202, {});

    const message = {
        alert: 'Hi'
    };

    const options = {
        criteria: {
            variants: [],
            categories: []
        }
    };

    sender().then((client) => {
        client.sender.send(message, options).then(() => {
            t.pass('should be ok');
            t.end();
        });
    });
});

test('send should be called with success with a proper options constructed with a criteria and a criteria with empty array values and real values', (t) => {
    nock('http://localhost:8080')
        .matchHeader('Accept', 'application/json')
        .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
        .matchHeader('Content-type', 'application/json')
        .post('/ag-push/rest/sender/', {
            criteria: {
                alias: ['1', '2']
            },
            message: {
                alert: 'Hi'
            }
        })
        .reply(202, {});

    const message = {
        alert: 'Hi'
    };

    const options = {
        criteria: {
            variants: [],
            categories: [],
            alias: ['1', '2']
        }
    };

    sender().then((client) => {
        client.sender.send(message, options).then(() => {
            t.pass('should be ok');
            t.end();
        });
    });
});

test('testing custom headers', (t) => {
    const settings = {
        url: 'http://localhost:8080/ag-push',
        applicationId: '1234',
        masterSecret: '1234',
        headers: {
            'X-Custom-Header': 'RainbowCat',
            'aerogear-sender': 'Custom Sender'
        }
    };

    nock('http://localhost:8080')
        .matchHeader('Accept', 'application/json')
        .matchHeader('aerogear-sender', 'Custom Sender')
        .matchHeader('Content-type', 'application/json')
        .matchHeader('X-Custom-Header', 'RainbowCat')
        .post('/ag-push/rest/sender/', {
            message: {
                alert: 'Hi'
            }
        })
        .reply(202, {});

    const message = {
        alert: 'Hi'
    };

    agSender(settings).then((client) => {
        client.sender.send(message).then(() => {
            t.pass('should be ok');
            t.end();
        });
    });
});

test('send should be called with success with an array of messages', (t) => {
    const body = [
        {
            criteria: { alias: ['1'] },
            message: { alert: 'Hi 1' }
        },
        {
            criteria: { alias: ['2'] },
            message: { alert: 'Hi 2' }
        },
        {
            criteria: { alias: ['3'] },
            message: { alert: 'Hi 3' }
        }
    ];

    nock('http://localhost:8080')
        .matchHeader('Accept', 'application/json')
        .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
        .matchHeader('Content-type', 'application/json')
        .post('/ag-push/rest/sender/', body)
        .reply(202, {});

    const messages = [
        {
            message: { alert: 'Hi 1' },
            options: { alias: ['1'] }
        },
        {
            message: { alert: 'Hi 2' },
            options: { alias: ['2'] }
        },
        {
            message: { alert: 'Hi 3' },
            options: { alias: ['3'] }
        }
    ];
    console.log("HELLO 1");

    sender().then((client) => {
        client.sender.send(messages).then(() => {
            console.log("HELLO");
            t.pass('should be ok');
            t.end();
        });
    });
});
