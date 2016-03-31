var chai = require( "chai" ),
    sinonChai = require( "sinon-chai" ),
    sinon = require( "sinon" ),
    nock = require( "nock" ),
    expect = require( "chai" ).expect,
    AeroGear = require( "../lib/unifiedpush-node-sender" ),
    url = "http://localhost:8080/ag-push",
    otherUrl = "http://localhost:8080/ag-push/";

chai.use( sinonChai );

describe( "Sender", function() {
    describe( "Create", function() {
        var settings = {
            url: 'http://localhost:8080/ag-push',
            applicationId: '1234',
            masterSecret: '1234'
        };

        it( "Sender should be an object", function() {
            var sender = AeroGear.Sender( settings );
            expect( sender ).to.be.an( "object" );
        });

        it( "Sender should inherit events", function() {
            var sender = AeroGear.Sender( settings );
            expect( sender.emit ).to.exist;
        });

        it( "Sender should have a send method", function() {
            var sender = AeroGear.Sender( settings );
            expect( sender.send ).to.exist;
        });

        it( "Sender should have a URL constructed", function() {
            var sender = AeroGear.Sender( settings );
            expect( sender.getUrl() ).to.equal( "http://localhost:8080/ag-push/rest/sender/" );
        });
        it( "Sender should have a URL constructed", function() {
            settings.url = "http://localhost:8080/ag-push/";
            var sender = AeroGear.Sender( settings );
            expect( sender.getUrl() ).to.equal( "http://localhost:8080/ag-push/rest/sender/" );
        });
    });

    describe( "Create", function() {
        var settings = {};

        it( "Sender should throw an error with nothing passed in", function() {
            expect( function(){ AeroGear.Sender(); } ).to.throw( "UnifiedPushSenderError" );
        });

        it( "Sender should throw an error missing applicationId and masterSecret", function() {
            settings.url = 'http://localhost';
            expect( function(){ AeroGear.Sender(settings); } ).to.throw( "UnifiedPushSenderError" );
        });

        it( "Sender should throw an error missing masterSecret", function() {
            settings.applicationId = '12345';
            expect( function(){ AeroGear.Sender(settings); } ).to.throw( "UnifiedPushSenderError" );
        });
    });
});

describe( "Sender - send", function() {
    var settings = {
            url: 'http://localhost:8080/ag-push',
            applicationId: '1234',
            masterSecret: '1234'
        },
        sender = AeroGear.Sender( settings ),
        message = {};

    beforeEach( function() {
        //settings = {};
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

            sender.send( message, {} ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });

        it( "send should be called with error", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/" )
            .replyWithError(400);

            sender.send( message, {} ).on( "error", function( error ) {
                expect( error ).to.be.ok;
                done();
            });
        });
    });
});

describe( "Sender - send", function() {
    var settings = {
            url: 'http://localhost:8080/ag-push',
            applicationId: '1234',
            masterSecret: '1234'
        },
        sender = AeroGear.Sender( settings ),
        message = {};

    beforeEach( function() {
        message = {};
    });


    describe( "send Method with callback with no options", function() {
        it( "send should be called with success", function( done ) {

            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/" )
            .reply( 200,{} );

            sender.send( message, function( err, response ) {
                expect( response ).to.be.ok;
                done();
            });
        });

        it( "send should be called with error with no options", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/" ).replyWithError(400);

            sender.send( message, function( err ) {
                if (err) {
                    done();
                }
            });
        });
    });

    describe( "send Method with callback with empty options", function() {
        it( "send should be called with success", function( done ) {

            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/" )
            .reply( 200,{} );

            sender.send( message, {}, function( err, response ) {
                expect( response ).to.be.ok;
                done();
            });
        });

        it( "send should be called with error with empty options", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/" ).replyWithError(400);

            sender.send( message, {}, function( err ) {
                expect( err ).to.be.ok;
                done();
            });
        });
    });
});

describe( "Sender - Handle Moved Status Codes", function() {
    var settings = {
            url: 'http://localhost:8080/ag-push',
            applicationId: '1234',
            masterSecret: '1234'
        },
        sender = AeroGear.Sender( settings ),
        message = {};

    beforeEach( function() {
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

            sender.send( message ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });
});

describe( "Sender - Message Params", function() {
    var settings = {
            url: 'http://localhost:8080/ag-push',
            applicationId: '1234',
            masterSecret: '1234'
        },
        sender = AeroGear.Sender( settings ),
        message = {};

    beforeEach( function() {
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
                    title: "Title",
                    action: "Action",
                    badge: 2
                }
            })
            .reply( 200,{} );

            message = {
                alert: "Hi",
                title: "Title",
                action: "Action",
                sound: "default",
                badge: 2
            };

            sender.send( message ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });
});


describe( "Sender - Message Params", function() {
    var settings = {
            url: 'http://localhost:8080/ag-push',
            applicationId: '1234',
            masterSecret: '1234'
        },
        sender = AeroGear.Sender( settings ),
        message = {};

    beforeEach( function() {;
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
                    apns: {
                        "action-category": "action",
                        "content-available": true
                    }
                }
            })
            .reply( 200,{} );

            message = {
                alert: "Hi",
                sound: "default",
                badge: 2,
                apns: {
                    actionCategory: "action",
                    contentAvailable: true
                }
            };

            sender.send( message ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });
});

describe( "Sender - Message Params", function() {
    var settings = {
            url: 'http://localhost:8080/ag-push',
            applicationId: '1234',
            masterSecret: '1234'
        },
        sender = AeroGear.Sender( settings ),
        message = {};

    beforeEach( function() {;
        message = {};
    });

    describe( "Message params", function() {
        it( "send should be called with success with a proper message constructed for urlArgs", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/", {
                message: {
                    alert: "Hi",
                    sound: "default",
                    badge: 2,
                    apns: {
                        "url-args": ["arg1", "arg2"]
                    }
                }
            })
            .reply( 200,{} );

            message = {
                alert: "Hi",
                sound: "default",
                badge: 2,
                apns: {
                    urlArgs: ["arg1", "arg2"]
                }
            };

            sender.send( message ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });
});

describe( "Sender - Message Params", function() {
    var settings = {
            url: 'http://localhost:8080/ag-push',
            applicationId: '1234',
            masterSecret: '1234'
        },
        sender = AeroGear.Sender( settings ),
        message = {};

    beforeEach( function() {
        message = {};
    });

    describe( "Message params", function() {
        it( "send should be called with success with a proper message constructed for titleLocKey and titleLocArgs", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/", {
                message: {
                    alert: "Hi",
                    sound: "default",
                    badge: 2,
                    apns: {
                        "title-loc-key": "value",
                        "title-loc-args": ["arg1", "arg2"]
                    }
                }
            })
            .reply( 200,{} );

            message = {
                alert: "Hi",
                sound: "default",
                badge: 2,
                apns: {
                    titleLocKey: "value",
                    titleLocArgs: ["arg1", "arg2"]
                }
            };

            sender.send( message ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });
});


describe( "Sender - Message Params", function() {
    var settings = {
            url: 'http://localhost:8080/ag-push',
            applicationId: '1234',
            masterSecret: '1234'
        },
        sender = AeroGear.Sender( settings ),
        options = {},
        message = {};

    beforeEach( function() {
        options = {};
        message = {};
    });

    describe( "Message params", function() {
        it( "send should be called with success with a proper message constructed for simplePush", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/", {
                message: {
                    alert: "Hi",
                    sound: "default",
                    badge: 2,
                    "simple-push":"version=1"
                }
            })
            .reply( 200,{} );

            message = {
                alert: "Hi",
                sound: "default",
                badge: 2,
                simplePush: "version=1"
            };

            sender.send( message, options ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });
});

describe( "Sender - Message Params", function() {
    var settings = {
            url: 'http://localhost:8080/ag-push',
            applicationId: '1234',
            masterSecret: '1234'
        },
        sender = AeroGear.Sender( settings ),
        options = {},
        message = {};

    beforeEach( function() {
        options = {};
        message = {};
    });

    describe( "Message params", function() {
        it( "send should be called with success with a proper message constructed for user-data", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/", {
                message: {
                    alert: "Hi",
                    sound: "default",
                    badge: 2,
                    "user-data": {
                        anotherKey: "Key"
                    }
                }
            })
            .reply( 200,{} );

            message = {
                alert: "Hi",
                sound: "default",
                badge: 2,
                userData: {
                    anotherKey: "Key"
                }
            };

            sender.send( message, options ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });
});

describe( "Sender - Message Params", function() {
    var settings = {
            url: 'http://localhost:8080/ag-push',
            applicationId: '1234',
            masterSecret: '1234'
        },
        sender = AeroGear.Sender( settings ),
        message = {};

    beforeEach( function() {;
        message = {};
    });

    describe( "Message params Windows and APNS", function() {
        it( "send should be called with success with a proper message constructed for actionCategory and contentAvailable and not camel case windows stuff", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/", {
                message: {
                    alert: "Hi",
                    sound: "default",
                    badge: 2,
                    apns: {
                        "action-category": "action",
                        "content-available": true
                    },
                    windows: {
                        tileType: "CoolBeansType"
                    }
                }
            })
            .reply( 200,{} );

            message = {
                alert: "Hi",
                sound: "default",
                badge: 2,
                apns: {
                    actionCategory: "action",
                    contentAvailable: true
                },
                windows: {
                    tileType: "CoolBeansType"
                }
            };

            sender.send( message ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });
});

describe( "Sender - Message Params", function() {
    var settings = {
            url: 'http://localhost:8080/ag-push',
            applicationId: '1234',
            masterSecret: '1234'
        },
        sender = AeroGear.Sender( settings ),
        options = {},
        message = {};

    beforeEach( function() {
        options = {};
        message = {};
    });

    describe( "Message params", function() {
        it( "send should be called with success with a proper message with a priority added", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/", {
                message: {
                    alert: "Hi",
                    sound: "default",
                    badge: 2,
                    priority: "normal"
                }
            })
            .reply( 200,{} );

            message = {
                alert: "Hi",
                sound: "default",
                badge: 2,
                priority: "normal"
            };

            sender.send( message, options ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });
});

describe( "Sender - Options Params", function() {
    var settings = {
            url: 'http://localhost:8080/ag-push',
            applicationId: '1234',
            masterSecret: '1234'
        },
        sender = AeroGear.Sender( settings ),
        options = {},
        message = {};

    beforeEach( function() {
        options = {};
        message = {};
    });

    describe( "Option params", function() {
        it( "send should be called with success with a proper options constructed with a config and no criteria", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/", {
                config: {
                    ttl: 3600
                },
                message: {
                    alert: "Hi",
                    sound: "default",
                    badge: 2,
                    "simple-push":"version=1"
                }
            })
            .reply( 200,{} );

            message = {
                alert: "Hi",
                sound: "default",
                badge: 2,
                simplePush: "version=1"
            };

            options = {
                config: {
                    ttl: 3600
                }
            }

            sender.send( message, options ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });
});


describe( "Sender - Options Params", function() {
    var settings = {
            url: 'http://localhost:8080/ag-push',
            applicationId: '1234',
            masterSecret: '1234'
        },
        sender = AeroGear.Sender( settings ),
        options = {},
        message = {};

    beforeEach( function() {
        options = {};
        message = {};
    });

    describe( "Option params", function() {
        it( "send should be called with success with a proper options constructed with a criteria and no config", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/", {
                criteria: {
                    variants: [ "1234", "56788" ],
                    categories: [ "category1", "category2" ]
                },
                message: {
                    alert: "Hi",
                    sound: "default",
                    badge: 2,
                    "simple-push":"version=1"
                }
            })
            .reply( 200,{} );

            message = {
                alert: "Hi",
                sound: "default",
                badge: 2,
                simplePush: "version=1"
            };

            options = {
                criteria: {
                    variants: [ "1234", "56788" ],
                    categories: [ "category1", "category2" ]
                }
            }

            sender.send( message, options ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });
});

describe( "Sender - Options Params", function() {
    var settings = {
            url: 'http://localhost:8080/ag-push',
            applicationId: '1234',
            masterSecret: '1234'
        },
        sender = AeroGear.Sender( settings ),
        options = {},
        message = {};

    beforeEach( function() {
        options = {};
        message = {};
    });

    describe( "Option params", function() {
        it( "send should be called with success with a proper options constructed with a criteria and a config", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/", {
                config: {
                    ttl: 3600
                },
                criteria: {
                    variants: [ "1234", "56788" ],
                    categories: [ "category1", "category2" ]
                },
                message: {
                    alert: "Hi",
                    sound: "default",
                    badge: 2,
                    "simple-push":"version=1"
                }
            })
            .reply( 200,{} );

            message = {
                alert: "Hi",
                sound: "default",
                badge: 2,
                simplePush: "version=1"
            };

            options = {
                config: {
                    ttl: 3600
                },
                criteria: {
                    variants: [ "1234", "56788" ],
                    categories: [ "category1", "category2" ]
                }
            }

            sender.send( message, options ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });
});

describe( "Sender - Options Params", function() {
    var settings = {
            url: 'http://localhost:8080/ag-push',
            applicationId: '1234',
            masterSecret: '1234'
        },
        sender = AeroGear.Sender( settings ),
        options = {},
        message = {};

    beforeEach( function() {
        options = {};
        message = {};
    });

    describe( "Option params", function() {
        it( "send should be called with success with a proper options constructed with a criteria and a criteria with empty array values", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/", {
                criteria: {
                },
                message: {
                    alert: "Hi"
                }
            })
            .reply( 200,{} );

            message = {
                alert: "Hi"
            };

            options = {
                criteria: {
                    variants: [],
                    categories: []
                }
            };

            sender.send( message, options ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });
});

describe( "Sender - Options Params", function() {
    var settings = {
            url: 'http://localhost:8080/ag-push',
            applicationId: '1234',
            masterSecret: '1234'
        },
        sender = AeroGear.Sender( settings ),
        options = {},
        message = {};

    beforeEach( function() {
        options = {};
        message = {};
    });

    describe( "Option params", function() {
        it( "send should be called with success with a proper options constructed with a criteria and a criteria with empty array values and real values", function( done ) {
            nock( "http://localhost:8080" )
            .matchHeader('Accept', 'application/json')
            .matchHeader('aerogear-sender', 'AeroGear Node.js Sender')
            .matchHeader('Content-type', 'application/json')
            .post( "/ag-push/rest/sender/", {
                criteria: {
                    alias: ['1', '2']
                },
                message: {
                    alert: "Hi"
                }
            })
            .reply( 200,{} );

            message = {
                alert: "Hi"
            };

            options = {
                criteria: {
                    variants: [],
                    categories: [],
                    alias: ['1', '2']
                }
            };

            sender.send( message, options ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });
});




describe( "Sender - Header Settings", function() {
    var settings = {
          url: 'http://localhost:8080/ag-push',
          applicationId: '1234',
          masterSecret: '1234',
          headers: {
              'X-Custom-Header': 'RainbowCat',
              'aerogear-sender': 'Custom Sender'
          }
      },
      sender = AeroGear.Sender( settings ),
      options = {},
      message = {};

    beforeEach( function() {
        options = {};
        message = {};
    });

    describe( "Option params", function() {
        it( "send should be called with success with a proper options constructed with a criteria and a criteria with empty array values and real values", function( done ) {
            nock( "http://localhost:8080" )
              .matchHeader('Accept', 'application/json')
              .matchHeader('aerogear-sender', 'Custom Sender')
              .matchHeader('Content-type', 'application/json')
              .matchHeader('X-Custom-Header', 'RainbowCat')
              .post( "/ag-push/rest/sender/", {
                  message: {
                      alert: "Hi"
                  }
              })
              .reply( 200,{} );

            message = {
                alert: "Hi"
            };

            options = {};

            sender.send( message, options ).on( "success", function( response ) {
                expect( response ).to.be.ok;
                done();
            });
        });
    });
});
