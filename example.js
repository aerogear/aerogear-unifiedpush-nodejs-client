var agSender = require( "./lib/aerogear-sender-client" ).AeroGear,
    url = "http://localhost:8080/ag-push",
    message,
    settings;

//Send a Message

message = {
    alert: "Hi",
    sound: "default",
    badge: 2,
    someKey: "some value",
    anotherCustomKey: "some other value"
};

settings = {
    applicationID: "aa3cfaad-8cd4-4b3c-af23-08417b879d00",
    masterSecret: "shhh",
    ttl: 3600,
    "simple-push": "version=123",
    criteria: {
        variants: [ "1234", "56788" ],
        categories: [ "category1", "category2" ]
    }
};

agSender.Sender( url ).send( message, settings )
    .on( "success", function( response ) {
        console.log( "success called", response );
    })
    .on( "error", function( err ) {
        console.log( err );
    });

