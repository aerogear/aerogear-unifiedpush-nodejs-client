# aerogear-sender-client [![Build Status](https://secure.travis-ci.org/lholmquist/aerogear-sender-client.png?branch=master)](http://travis-ci.org/lholmquist/aerogear-sender-client)

Node Sender API for the AeroGear Unified Push server

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

In your project do `npm install path/to/aerogear-unified-push-node-client`

## Examples

Require the `aerogear-sender-client` library

    var agSender = require( "aerogear-sender-client" ).AeroGear,
        url = "http://localhost:8080/ag-push";

Send a Broadcast Message

    agSender.Sender( url ).broadcast( message, settings ).on( "success", function( response ) {
        console.log( "success called", response );
    });

Send a Selective Message


    agSender.Sender( url ).sendTo( criteria, message, settings ).on( "success", function( response ) {
        console.log( "success called", response );
    });

