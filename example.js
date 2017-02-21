const agSender = require('./');

const settings = require('./settings.json');

const message = {
    alert: 'Hi',
    sound: 'default',
    badge: 2,
    userData: {
        someKey: 'some value',
        anotherCustomKey: 'some other value',
    }
};

const options = {
    config: {
        ttl: 3600,
    },
    criteria: {
        variants: ['1234', '56788'],
        categories: ['category1', 'category2']
    }
};

agSender(settings).then((client) => {
    return client.send(message, options).then((result) => {
        console.log(result);
    });
});


// A slightly more complex message example
const message2 = {
    'alert': 'HELLO!',
    'sound': 'default',
    'badge': 2,
    'user-data': {
        'key': 'value',
        'key2': 'other value'
    },
    'windows': {
        'type': 'tile',
        'duration': 'short',
        'badge': 'alert',
        'tileType': 'TileWideBlockAndText01',
        'images': ['Assets/test.jpg', 'Assets/background.png'],
        'textFields': ['foreground text']
    },
    'apns': {
        'title': 'someTitle',
        'action-category': 'some value',
        'content-available': true,
        'action': 'someAction',
        'url-args': ['args1', 'arg2'],
        'localized-title-key': 'some value',
        'localized-title-arguments': ['args1', 'arg2']
    }
};

agSender(settings).then((client) => {
    return client.send(message2, options).then((result) => {
        console.log(result);
    });
});

// A example using the batch method
const messages = [
    {
        message: {
            alert: 'Hello everybody!',
        }
    },
    {
        message: {
            alert: 'Oldies rule!',
        },
        options: {
            criteria: {
                variants: ['gameBoy', 'vhs', 'spectrum']
            }
        }
    },
    {
        message: {
            'alert': 'This is a very complex message!',
            'sound': 'default',
            'badge': 2,
            'user-data': {
                'key': 'value',
                'key2': 'other value'
            },
            'windows': {
                'type': 'tile',
                'duration': 'short',
                'badge': 'alert',
                'tileType': 'TileWideBlockAndText01',
                'images': ['Assets/test.jpg', 'Assets/background.png'],
                'textFields': ['foreground text']
            },
            'apns': {
                'title': 'someTitle',
                'action-category': 'some value',
                'content-available': true,
                'action': 'someAction',
                'url-args': ['args1', 'arg2'],
                'localized-title-key': 'some value',
                'localized-title-arguments': ['args1', 'arg2']
            }
        }
    }
];

agSender(settings).then((client) => {
    return client.sendBatch(messages).then((result) => {
        console.log(result);
    });
});
