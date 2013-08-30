# aerogear-sender-client [![Build Status](https://secure.travis-ci.org/lholmquist/aerogear-sender-client.png?branch=master)](http://travis-ci.org/lholmquist/aerogear-sender-client)

Node Sender API for the AeroGear Unified Push server

## Getting Started

clone the repo, and in your project do `npm install path/to/aerogear-unified-push-node-client`


```javascript
var agSender = require( "aerogear-sender-client" ).AeroGear;
agSender.Sender( url ).broadcast( message, options ).on( "success", function( response ) {
    console.log( "success called", response );
});
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
