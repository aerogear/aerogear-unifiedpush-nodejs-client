var chai = require( "chai" ),
    sinonChai = require( "sinon-chai" ),
    sinon = require( "sinon" ),
    nock = require( "nock" ),
    expect = require( "chai" ).expect,
    AeroGear = require( "../lib/aerogear-sender-client" ).AeroGear,
    url = "http://localhost:8080/ag-push";

chai.use( sinonChai );

describe( "Sender", function() {
    describe( "Create", function() {
        it( "Sender should be an object", function() {
            var sender = AeroGear.Sender( url );
            expect( sender ).to.be.an( "object" );
        });

        it( "Sender should inherit events", function() {
            var sender = AeroGear.Sender( url );
            expect( sender.emit ).to.exist;
        });

        it( "Sender should have a send method", function() {
            var sender = AeroGear.Sender( url );
            expect( sender.send ).to.exist;
        });

        it( "Sender should have a URL constructed", function() {
            var sender = AeroGear.Sender( url );
            expect( sender.getUrl() ).to.equal( "http://localhost:8080/ag-push/rest/sender/" );
        });
    });

    describe( "Create", function() {
        it( "Sender should throw an error", function() {
            expect( function(){ AeroGear.Sender(); } ).to.throw( "UnifiedPushSenderError" );
        });
    });
});

describe( "Sender - send", function() {
    var sender = AeroGear.Sender( url ),
            applicationID = "12345",
            masterSecret = "54321",
            settings = {},
            message = {};

    beforeEach( function() {
        settings = {};
        message = {};
    });


    describe( "send Method", function() {
        it( "send should be called with success", function( done ) {

            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/" )
            .reply( 200,{} );

            settings.applicationID = applicationID;
            settings.masterSecret = masterSecret;

            sender.send( message, settings ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });

        it( "send should be called with error", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/" ).reply( 400,{} );

            settings.applicationID = applicationID;
            settings.masterSecret = masterSecret;

            sender.send( message, settings ).on( "error", function( error ) {
                expect( error ).to.be.ok;
                done();
            });
        });
    });
});

describe( "Sender - send", function() {
    var sender = AeroGear.Sender( url ),
            applicationID = "12345",
            masterSecret = "54321",
            settings = {},
            message = {};

    beforeEach( function() {
        settings = {};
        message = {};
    });


    describe( "send Method", function() {
        it( "send should be called with success and 'emit' success with callback as an object", function( done ) {

            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/" )
            .reply( 200,{} );

            settings.applicationID = applicationID;
            settings.masterSecret = masterSecret;

            sender.send( message, settings, {} ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });

        it( "send should be called with error and 'emit' error with a callback as an object", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/" ).reply( 400,{} );

            settings.applicationID = applicationID;
            settings.masterSecret = masterSecret;

            sender.send( message, settings, {} ).on( "error", function( error ) {
                expect( error ).to.be.ok;
                done();
            });
        });
    });
});

describe( "Sender - send", function() {
    var sender = AeroGear.Sender( url ),
            applicationID = "12345",
            masterSecret = "54321",
            settings = {},
            message = {};

    beforeEach( function() {
        settings = {};
        message = {};
    });


    describe( "send Method with callback", function() {
        it( "send should be called with success", function( done ) {

            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/" )
            .reply( 200,{} );

            settings.applicationID = applicationID;
            settings.masterSecret = masterSecret;

            sender.send( message, settings, function( err, response ) {
                expect( response ).to.be.ok;
                done();
            });
        });

        it( "send should be called with error", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/" ).reply( 400,{} );

            settings.applicationID = applicationID;
            settings.masterSecret = masterSecret;

            sender.send( message, settings, function( err ) {
                expect( err ).to.be.ok;
                done();
            });
        });
    });
});

describe( "Sender", function() {
    var sender = AeroGear.Sender( url ),
            applicationID = "12345",
            masterSecret = "54321",
            settings = {},
            message = {};

    beforeEach( function() {
        settings = {};
        message = {};
    });
    describe( "send - throw errors", function() {
         it( "send should throw an error with no masterSecret", function() {
            settings.applicationID = applicationID;
            expect( function(){ sender.send( message, settings ); } ).to.throw( "UnifiedPushSenderError" );
        });
        it( "send should throw an error with no applicationID", function() {
            settings.masterSecret = masterSecret;
            expect( function(){ sender.send( message, settings ); } ).to.throw( "UnifiedPushSenderError" );
        });
        it( "send should throw an error with no applicationID and no masterSecret", function() {
            settings.masterSecret = masterSecret;
            expect( function(){ sender.send( message, settings ); } ).to.throw( "UnifiedPushSenderError" );
        });
    });
});

describe( "Sender - Handle Moved Status Codes", function() {
    var sender = AeroGear.Sender( url ),
            applicationID = "12345",
            masterSecret = "54321",
            settings = {},
            message = {};

    beforeEach( function() {
        settings = {};
        message = {};
    });

    describe( "Endpoint returns moved", function() {
        it( "send should be called with success", function( done ) {

            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/" )
            .reply( 302,{},{'location': "http://localhost:8080/rest/new/sender"} )
            .post( "/rest/new/sender" )
            .reply( 200, {} );

            settings.applicationID = applicationID;
            settings.masterSecret = masterSecret;

            sender.send( message, settings ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });

    describe( "Endpoint returns moved, with no new location", function() {
        it( "send should be called with error", function( done ) {

            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/" )
            .reply( 302,{},{} );

            settings.applicationID = applicationID;
            settings.masterSecret = masterSecret;

            sender.send( message, settings ).on( "error", function( error ) {
                expect( error ).to.be.ok;
                expect( error ).to.equal( "redirect url is not available" );
                done();
            });
        });
    });
});


describe( "Sender - Message Params", function() {
    var sender = AeroGear.Sender( url ),
            applicationID = "12345",
            masterSecret = "54321",
            settings = {},
            message = {};

    beforeEach( function() {
        settings = {};
        message = {};
    });


    describe( "Message params", function() {
        it( "send should be called with success with a proper message constructed", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/", {
                message: {
                    alert: "Hi",
                    sound: "default",
                    badge: 2
                }
            })
            .reply( 200,{} );

            settings.applicationID = applicationID;
            settings.masterSecret = masterSecret;

            message = {
                alert: "Hi",
                sound: "default",
                badge: 2
            };

            sender.send( message, settings ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });
});


describe( "Sender - Message Params", function() {
    var sender = AeroGear.Sender( url ),
            applicationID = "12345",
            masterSecret = "54321",
            settings = {},
            message = {};

    beforeEach( function() {
        settings = {};
        message = {};
    });

    describe( "Message params", function() {
        it( "send should be called with success with a proper message constructed for actionCategory and contentAvailable", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/", {
                message: {
                    alert: "Hi",
                    sound: "default",
                    badge: 2,
                    "action-category": "action",
                    "content-available": true
                }
            })
            .reply( 200,{} );

            settings.applicationID = applicationID;
            settings.masterSecret = masterSecret;

            message = {
                alert: "Hi",
                sound: "default",
                badge: 2,
                actionCategory: "action",
                contentAvailable: true
            };

            sender.send( message, settings ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });
});


describe( "Sender - Message Params", function() {
    var sender = AeroGear.Sender( url ),
            applicationID = "12345",
            masterSecret = "54321",
            settings = {},
            message = {};

    beforeEach( function() {
        settings = {};
        message = {};
    });

    describe( "Message params", function() {
        it( "send should be called with success with a proper message constructed for actionCategory and contentAvailable", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/", {
                "simple-push":"version=1",
                message: {
                    alert: "Hi",
                    sound: "default",
                    badge: 2
                }
            })
            .reply( 200,{} );

            settings.applicationID = applicationID;
            settings.masterSecret = masterSecret;
            settings.simplePush = 'version=1';

            message = {
                alert: "Hi",
                sound: "default",
                badge: 2
            };

            sender.send( message, settings ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });
});
