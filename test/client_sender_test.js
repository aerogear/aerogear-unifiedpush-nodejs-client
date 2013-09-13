var chai = require( "chai" ),
    sinonChai = require( "sinon-chai" ),
    nock = require( "nock" ),
    expect = require( "chai" ).expect,
    AeroGear = require( "../lib/aerogear-sender-client" ).AeroGear,
    server;

chai.use( sinonChai );

describe( "Sender", function() {
    describe( "Create", function() {
        it( "Sender should be an object", function() {
            var sender = AeroGear.Sender();
            expect( sender ).to.be.an( "object" );
        });

        it( "Sender should inherit events", function() {
            var sender = AeroGear.Sender();
            expect( sender.emit ).to.exist;
        });

        it( "Sender should have a broadcast method", function() {
            var sender = AeroGear.Sender();
            expect( sender.broadcast ).to.exist;
        });

        it( "Sender should have a sendTo method", function() {
            var sender = AeroGear.Sender();
            expect( sender.sendTo ).to.exist;
        });

        it( "Sender should have a URL constructed", function() {
            var sender = AeroGear.Sender( "http://localhost:8080/ag-push" );
            expect( sender.getUrl() ).to.equal( "http://localhost:8080/ag-push/rest/sender/" );
        });
    });
});

describe( "Sender Broadcast", function() {
    var sender = AeroGear.Sender( "http://localhost:8080/ag-push" ),
            applicationID = "12345",
            masterSecret = "54321",
            settings = {},
            message = {};

    beforeEach( function() {
        settings = {};
        message = {};
    });


    describe( "Broadcast Method", function() {
        it( "broadcast should be called with success", function( done ) {

            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/broadcast" )
            .reply( 200,{} );

            settings.applicationID = applicationID;
            settings.masterSecret = masterSecret;

            sender.broadcast( message, settings ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });

        it( "broadcast should be called with error", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/broadcast" ).reply( 400,{} );

            settings.applicationID = applicationID;
            settings.masterSecret = masterSecret;

            sender.broadcast( message, settings ).on( "error", function( error ) {
                expect( error ).to.be.ok;
                done();
            });
        });
    });
});

describe( "Sender - sendTo", function() {
    var sender = AeroGear.Sender( "http://localhost:8080/ag-push" ),
            applicationID = "12345",
            masterSecret = "54321",
            settings = {},
            message = {};

    beforeEach( function() {
        settings = {};
        message = {};
    });


    describe( "sendTo Method", function() {
        it( "broadcast should be called with success", function( done ) {

            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/selected" )
            .reply( 200,{} );

            settings.applicationID = applicationID;
            settings.masterSecret = masterSecret;

            sender.sendTo( message, settings ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });

        it( "broadcast should be called with error", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/selected" ).reply( 400,{} );

            settings.applicationID = applicationID;
            settings.masterSecret = masterSecret;

            sender.sendTo( message, settings ).on( "error", function( error ) {
                expect( error ).to.be.ok;
                done();
            });
        });
    });
});

describe( "Sender - Handle Moved Status Codes", function() {
    var sender = AeroGear.Sender( "http://localhost:8080/ag-push" ),
            applicationID = "12345",
            masterSecret = "54321",
            settings = {},
            message = {};

    beforeEach( function() {
        settings = {};
        message = {};
    });


    describe( "Endpoint returns moved", function() {
        it( "broadcast should be called with success", function( done ) {

            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/broadcast" )
            .reply( 302,{},{'location': "http://localhost:8080/rest/new/sender"} )
            .post( "/rest/new/sender" )
            .reply( 200, {} );

            settings.applicationID = applicationID;
            settings.masterSecret = masterSecret;

            sender.broadcast( message, settings ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });

    describe( "Endpoint returns moved, with no new location", function() {
        it( "broadcast should be called with error", function( done ) {

            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/broadcast" )
            .reply( 302,{},{} );

            settings.applicationID = applicationID;
            settings.masterSecret = masterSecret;

            sender.broadcast( message, settings ).on( "error", function( error ) {
                expect( error ).to.be.ok;
                expect( error ).to.equal( "redirect url is not available" );
                done();
            });
        });
    });

    // describe( "Endpoint returns moved", function() {
    //     it( "sendTo should be called with success", function( done ) {

    //         nock( "http://localhost:8080" )
    //         .matchHeader('Accept', 'application/json')
    //         .matchHeader('Content-type', 'application/json')
    //         .post( "/ag-push/rest/sender/selected" )
    //         .reply( 302,{},{'location': "http://localhost:8080/rest/new/sender"} )
    //         .post( "/rest/new/sender" )
    //         .reply( 200, {} );

    //         settings.applicationID = applicationID;
    //         settings.masterSecret = masterSecret;

    //         sender.sendTo( message, settings ).on( "success", function( response ) {
    //             expect( response ).to.be.ok;
    //             done();
    //         });
    //     });
    // });

    // describe( "Endpoint returns moved, with no new location", function() {
    //     it( "sendTo should be called with error", function( done ) {

    //         nock( "http://localhost:8080" )
    //         .matchHeader('Accept', 'application/json')
    //         .matchHeader('Content-type', 'application/json')
    //         .post( "/ag-push/rest/sender/selected" )
    //         .reply( 302,{},{} );

    //         settings.applicationID = applicationID;
    //         settings.masterSecret = masterSecret;

    //         sender.sendTo( message, settings ).on( "error", function( error ) {
    //             expect( error ).to.be.ok;
    //             expect( error ).to.equal( "redirect url is not available" );
    //             done();
    //         });
    //     });
    // });
});

describe( "Sender - Handle Moved Status Codes", function() {
    var sender = AeroGear.Sender( "http://localhost:8080/ag-push" ),
            applicationID = "12345",
            masterSecret = "54321",
            settings = {},
            message = {};

    beforeEach( function() {
        settings = {};
        message = {};
    });

    describe( "Endpoint returns moved", function() {
        it( "sendTo should be called with success", function( done ) {

            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/selected" )
            .reply( 302,{},{'location': "http://localhost:8080/rest/new/sender"} )
            .post( "/rest/new/sender" )
            .reply( 200, {} );

            settings.applicationID = applicationID;
            settings.masterSecret = masterSecret;

            sender.sendTo( message, settings ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });

    describe( "Endpoint returns moved, with no new location", function() {
        it( "sendTo should be called with error", function( done ) {

            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/selected" )
            .reply( 302,{},{} );

            settings.applicationID = applicationID;
            settings.masterSecret = masterSecret;

            sender.sendTo( message, settings ).on( "error", function( error ) {
                expect( error ).to.be.ok;
                expect( error ).to.equal( "redirect url is not available" );
                done();
            });
        });
    });
});
