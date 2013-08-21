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
    https = require( "https" ),
    urlParser = require( "url" ),
    util = require( "util" ),
    events = require( "events" );


// TODO: hmmm, should this be a method in the contructor?
function send( serverSettings, message ) {

    // we stash the 'https' module on a local variable, IF the server is deployed using SSL.
    // Otherwise the 'http' module is stashed
    var caller = (serverSettings.protocol === "https:") ? https : http;

    var that = this,
        req = caller.request( serverSettings, function( res ) {

            if( res.statusCode >= 400 ) {
                that.emit( "error", res.statusCode );
            } else {
                res.setEncoding('utf8');
                res.on( "data", function ( chunk ) {
                    that.emit( "success", chunk );
                });
            }
        });

    req.on( "error", function( error ) {
        that.emit( "error", "problem with request: " + error.message );
    });

    // write data to request body
    req.end( JSON.stringify( message ), "utf8" );
}

function createServerSettings( url, settings ) {
    var serverSettings = {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"
        },
        auth: settings.applicationID + ":" + settings.masterSecret,
        method: "POST"
    };

    return serverSettings;
}


var AeroGear = {};

/**
    The AeroGear.Sender does cool stuff
    @class
    @param {String} [baseUrl] - The base url of the unified push server
    @returns {Object} sender - A cool thing
    @example
 **/
AeroGear.Sender = function( baseUrl ) {
    if ( !( this instanceof  AeroGear.Sender ) ) {
        return new  AeroGear.Sender( baseUrl );
    }

    events.EventEmitter.call( this );

    var url = baseUrl ? baseUrl : "http://localhost:8080/ag-push";

    url += "/rest/sender/";

    this.getUrl = function() {
        return url;
    };
};

util.inherits( AeroGear.Sender, events.EventEmitter );

exports.AeroGear = AeroGear;

/**
    The Broadcast Method
    @param {Object} [message={}] - the message to be passed
    @param {String} [message.alert]
    @param {String} [message.sound]
    @param {String} [message.badge]
    // TODO: add more message params?
    @param {Object} [settings={}] - the settings to be passed to the adapter
    @param {String} [settings.applicationID] - The Application ID
    @param {String} [settings.masterSecret] - The Master Secret
    @returns {Object} itself
    @example

 */
AeroGear.Sender.prototype.broadcast = function( message, settings ) {
    settings = settings || {};

    var url,
        serverOptions;

    url = urlParser.parse( this.getUrl() + "broadcast" );
    serverOptions = createServerSettings( url, settings );

    send.call( this, serverOptions, message );

    return this;
};


/**
    The Broadcast Method
    @param {Object} [criteria={}] - the criteria to select
    @param {Array} [criteria.alias] - a list of email or name strings
    @param {Array} [criteria.deviceType] - a list of device types as strings
    @param {Array} [criteria.category] - a list of categories as strings
    @param {Array} [criteria.variants] - a list of variantID's as strings
    @param {Object} [message={}] - the message to be passed
    @param {String} [message.alert]
    @param {String} [message.sound]
    @param {String} [message.badge]
    // TODO: add more message params?
    @param {Object} [settings={}] - the settings to be passed to the adapter
    @param {String} [settings.applicationID] - The Application ID
    @param {String} [settings.masterSecret] - The Master Secret
    @returns {Object} itself
    @example

 */
AeroGear.Sender.prototype.sendTo = function( criteria, message, settings ) {

    settings = settings || {};

    var url,
        serverSettings,
        newMessage = {};

    //TODO: needs to be dryed out
    newMessage.alias = criteria.alias;
    newMessage.deviceType = criteria.deviceType;
    newMessage.category = criteria.category;
    newMessage.variants = criteria.variants;

    newMessage.message = message;

    url = urlParser.parse( this.getUrl() + "selected" );
    serverSettings = createServerSettings( url, settings );

    send.call( this, serverSettings, newMessage );

    return this;
};
