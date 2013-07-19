/* AeroGear JavaScript Library
* https://github.com/aerogear/aerogear-js
* JBoss, Home of Professional Open Source
* Copyright Red Hat, Inc., and individual contributors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var http = require( "http" ),
    urlParser = require( "url" ),
    util = require( "util" ),
    events = require( "events" );


// TODO: hmmm, should this be a method in the contructor?
function send( serverOptions, message ) {
    var that = this,
        req = http.request( serverOptions, function( res ) {

            if( res.statusCode >= 400 ) {
                that.emit( "error", res.statusCode );
            }

            res.setEncoding('utf8');
            res.on( "data", function ( chunk ) {
                that.emit( "success", chunk );
            });
        });

    req.on( "error", function( error ) {
        that.emit( "error", "problem with request: " + error.message );
    });

    // write data to request body
    req.end( JSON.stringify( message ), "utf8" );
}

function createServerOptions( url, options ) {
    var serverOptions = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"
        },
        auth: options.applicationID + ":" + options.masterSecret,
        method: "POST"
    };

    return serverOptions;
}


var AeroGear = {};



AeroGear.sender = function( options ) {
    if ( !( this instanceof  AeroGear.sender ) ) {
        return new  AeroGear.sender( options );
    }

    events.EventEmitter.call( this );

    options = options || {};

    var url = options.url ? options.url : "http://localhost:8080/ag-push/";

    url += "rest/sender/";

    this.getUrl = function() {
        return url;
    };
};

util.inherits( AeroGear.sender, events.EventEmitter );

exports.AeroGear = AeroGear;

AeroGear.sender.prototype.broadcast = function( message, options ) {
    options = options || {};

    var url,
        serverOptions;

    url = urlParser.parse( this.getUrl() + "broadcast" );
    serverOptions = createServerOptions( url, options );

    send.call( this, serverOptions, message );

    return this;
};


// Not yet ready,  Should there be another parameter or just include them in the options
/*AeroGear.sender.prototype.sendTo = function( clientIdentifiers, message, options ) {

    options = options || {};

    message.alias = clientIdentifiers;

    var url,
        serverOptions;

    url = urlParser.parse( this.getUrl() + "broadcast" );
    serverOptions = createServerOptions( url, options );

    send.call( this, serverOptions, message );

    return this;
};*/
