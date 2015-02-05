# unifiedpush-node-sender [![Build Status](https://secure.travis-ci.org/aerogear/aerogear-unifiedpush-nodejs-client.png?branch=master)](https://travis-ci.org/aerogear/aerogear-unifiedpush-nodejs-client)

Node Sender API for the AeroGear Unified Push server

|                 | Project Info  |
| --------------- | ------------- |
| License:        | Apache License, Version 2.0  |
| Build:          | npm  |
| Documentation:  | https://aerogear.org/push/  |
| Issue tracker:  | https://issues.jboss.org/browse/AGPUSH  |
| Mailing lists:  | [aerogear-users](http://aerogear-users.1116366.n5.nabble.com/) ([subscribe](https://lists.jboss.org/mailman/listinfo/aerogear-users))  |
|                 | [aerogear-dev](http://aerogear-dev.1069024.n5.nabble.com/) ([subscribe](https://lists.jboss.org/mailman/listinfo/aerogear-dev))  |

## Getting Started

### Pre Reqs:
* node.js
* npm
* git

### Building

clone and install:

    $ git@github.com:aerogear/aerogear-unifiedpush-nodejs-client.git

    $ cd aerogear-unifiedpush-nodejs-client

    $ npm install

### Running Tests

    $ npm test


### Add to a Project

In your project do

    npm install path/to/aerogear-unified-push-node-client

or

install from npm

    npm install unifiedpush-node-sender



## Examples

Require the `unifiedpush-node-sender` library

    var agSender = require( "unifiedpush-node-sender" ),
        settings = {
            url: "http://localhost:8080/ag-push",
            applicationId: "12345",
            masterSecret: "123456"
        };

### Send a Message

You can use either listen for the success and error events


    agSender.Sender( settings ).send( message, options ).on( "success", function( response ) {
        console.log( "success called", response );
    });

Or you can use a callback

    agSender.Sender( settings ).send( message, options, function( err, response ) {
        if( !err ) {
            console.log( "success called", response );
            return;
        }
    });

## Documentation

For more details about the current release, please consult [our documentation](https://aerogear.org/docs/unifiedpush/).

## Development

If you would like to help develop AeroGear you can join our [developer's mailing list](https://lists.jboss.org/mailman/listinfo/aerogear-dev), join #aerogear on Freenode, or shout at us on Twitter @aerogears.

Also takes some time and skim the [contributor guide](http://aerogear.org/docs/guides/Contributing/)

## Questions?

Join our [user mailing list](https://lists.jboss.org/mailman/listinfo/aerogear-users) for any questions or help! We really hope you enjoy app development with AeroGear!

## Found a bug?

If you found a bug please create a ticket for us on [Jira](https://issues.jboss.org/browse/AGPUSH) with some steps to reproduce it.
