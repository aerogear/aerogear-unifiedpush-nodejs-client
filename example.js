var agSender = require( "./lib/aerogear-sender-client" ).AeroGear,
    url = "http://localhost:8080/ag-push",
    message,
    settings;

//Send a Selective Message

message = {
    alert: "Hi"
};

settings = {
    applicationID: "aa3cfaad-8cd4-4b3c-af23-08417b879d00",
    masterSecret: "SHHHHHH",
    criteria: {
        "simple-push": {
            "broadcast": "version="+ new Date().getTime() + ""
        }
    }
};

agSender.Sender( url ).send( message, settings )
    .on( "success", function( response ) {
        console.log( "success called", response );
    })
    .on( "error", function( err ) {
        console.log( err );
    });

