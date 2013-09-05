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

        it( "Sender should have a URL contructed", function() {
            var sender = AeroGear.Sender(
                {
                    baseURL: "http://localhost:8080/ag-push",
                    endpoint: "/sender"
                });
            expect( sender.getUrl() ).to.equal( "http://localhost:8080/ag-push/sender" );
        });
    });
});

describe( "Sender Broadcast", function() {
    var sender = AeroGear.Sender(
                {
                    baseURL: "http://localhost:8080/ag-push",
                    endpoint: "/sender/"
                }),
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
            .post( "/ag-push/sender/broadcast" )
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
            .post( "/ag-push/sender/broadcast" ).reply( 400,{} );

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
    var sender = AeroGear.Sender(
                {
                    baseURL: "http://localhost:8080/ag-push",
                    endpoint: "/sender/"
                }),
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
            .post( "/ag-push/sender/selected" )
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
            .post( "/ag-push/sender/selected" ).reply( 400,{} );

            settings.applicationID = applicationID;
            settings.masterSecret = masterSecret;

            sender.sendTo( message, settings ).on( "error", function( error ) {
                expect( error ).to.be.ok;
                done();
            });
        });
    });
});
