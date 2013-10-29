# aerogear-sender-client [![Build Status](https://secure.travis-ci.org/aerogear/aerogear-unifiedpush-nodejs-client.png?branch=master)](https://travis-ci.org/aerogear/aerogear-unifiedpush-nodejs-client)

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

In your project do

    npm install path/to/aerogear-unified-push-node-client

or

install from npm

    npm install aerogear-sender-client



## Examples

Require the `aerogear-sender-client` library

    var agSender = require( "aerogear-sender-client" ).AeroGear,
        url = "http://localhost:8080/ag-push";

Send a Message


    agSender.Sender( url ).send( message, settings ).on( "success", function( response ) {
        console.log( "success called", response );
    });

