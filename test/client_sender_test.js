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

        it( "Sender should have a send method", function() {
            var sender = AeroGear.Sender();
            expect( sender.send ).to.exist;
        });

        it( "Sender should have a URL constructed", function() {
            var sender = AeroGear.Sender( "http://localhost:8080/ag-push" );
            expect( sender.getUrl() ).to.equal( "http://localhost:8080/ag-push/rest/sender/" );
        });
    });
});

describe( "Sender - send", function() {
    var sender = AeroGear.Sender( "http://localhost:8080/ag-push" ),
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
        it( "send should be called with success", function( done ) {

            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
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
        it( "send should be called with success", function( done ) {

            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
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
