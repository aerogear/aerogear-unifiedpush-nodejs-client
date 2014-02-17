#!/usr/bin/env node

var nopt = require( "nopt" ),
    knownOpts = {
        "url": [ String, null ],
        "application-id": [ String, null ],
        "application-secret": [ String, null ],
        "message": [ String, null ],
        "simple-push": [ String, Boolean ],
        "version": [ Boolean, null ], // Not the simplePush Version
        "debug": Boolean
    },
    shortHands = {
        "u": [ "--url" ],
        "a": [ "--app", "--application-id" ],
        "s": [ "--secret", "--application-secret" ],
        "m": [ "--message" ],
        "sp": [ "--simple-push" ],
        "v": [ "--version" ], // Not the simplePush Version
        "d": [ "--debug" ]
    },
    parsed = nopt( knownOpts, shortHands, process.argv, 2 ),
    agSender = require( "../lib/aerogear-sender-client" ).AeroGear,
    message, settings;

if( parsed.version ) {
    console.log( require( "../package.json" ).version );
    process.exit( 0 );
}

if( !parsed.url ) {
    console.error( "No URL" );
    if( parsed.debug ) {
        console.error( "The URL must be valid and in the format http://host:port/context" );
    }
    process.exit( 1 );
}

//Send a Message

message = {
    alert: parsed.message,
    sound: "default",
    badge: 1
};

settings = {
    applicationID: parsed.app,
    masterSecret: parsed.secret,
    ttl: 3600
};

if( parsed[ "simple-push" ] ) {
    // Add Simple Push
    settings[ "simple-push" ] = "version=" + ( parsed[ "simple-push" ] === "true" ? new Date().getTime() : parsed[ "simple-push" ] );
}

if( parsed.debug ) {
    console.log( "URL", parsed.url );
    console.log( "message", message );
    console.log( "settings:", settings );
}

agSender.Sender( parsed.url )
    .send( message, settings )
    .on( "success", function( response ) {
        console.log( "Message Sent" );
        if( parsed.debug ) {
            console.log( "Response: ", response );
        }
    })
    .on( "error", function( err ) {
        console.error( "There was an error sending the message" );
        if( parsed.debug ) {
            console.error( "Error: ", err );
        }
    });
