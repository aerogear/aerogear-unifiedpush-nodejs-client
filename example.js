var agSender = require( "./lib/unifiedpush-node-sender" ),
    message,
    settings,
    options;

//Send a Message
settings = require( "./settings.json" );

message = {
    alert: "Hi",
    sound: "default",
    badge: 2,
    simplePush: "version=123",
    userData: {
        someKey: "some value",
        anotherCustomKey: "some other value",
    }
};

options = {
    config: {
        ttl: 3600,
    },
    criteria: {
        variants: [ "1234", "56788" ],
        categories: [ "category1", "category2" ]
    }
};

agSender.Sender( settings ).send( message, options )
    .on( "success", function( response ) {
        console.log( "success called", response );
    })
    .on( "error", function( err ) {
        console.log( err );
    });


// A slightly more complex message example

message = {
    "alert": "HELLO!",
    "sound": "default",
    "badge": 2,
    "user-data": {
        "key": "value",
        "key2": "other value"
    },
    "windows": {
        "type": "tile",
        "duration": "short",
        "badge": "alert",
        "tileType": "TileWideBlockAndText01",
        "images": ["Assets/test.jpg", "Assets/background.png"],
        "textFields": ["foreground text"]
    },
    "apns": {
        "title" : "someTitle",
        "action-category": "some value",
        "content-available": true,
        "action" : "someAction",
        "url-args" :["args1","arg2"],
        "localized-title-key" : "some value",
        "localized-title-arguments" : ["args1","arg2"]
    }
};

//you can also use just the callback pattern
agSender.Sender( settings ).send( message, options, function( err, response ) {
    if( err ) {
        console.log( err );
        return;
    }
    console.log( "success called", response );
});
