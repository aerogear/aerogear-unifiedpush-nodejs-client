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
    someKey: "some value",
    anotherCustomKey: "some other value"
};

options = {
    ttl: 3600,
    simplePush: "version=123",
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


// Or you can use just the callback
agSender.Sender( settings ).send( message, options, function( err, response ) {
    if( err ) {
        console.log( err );
        return;
    }
    console.log( "success called", response );
});
