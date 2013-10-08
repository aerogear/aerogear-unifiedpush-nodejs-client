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

function send( serverSettings, message ) {

    // we stash the 'https' module on a local variable, IF the server is deployed using SSL.
    // Otherwise the 'http' module is stashed
    var caller = (serverSettings.protocol === "https:") ? https : http,
        that = this,
        req = caller.request( serverSettings, function( res ) {

            if( res.statusCode >= 400 ) {
                that.emit( "error", res.statusCode );
            } else if( res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303 ) {
                //Moved Status,  Need to resend
                if( !res.headers.location ) {
                    that.emit( "error", "redirect url is not available" );
                } else {
                    var url = urlParser.parse( res.headers.location );

                    //Better way i think
                    serverSettings.protocol = url.protocol;
                    serverSettings.hostname =  url.hostname;
                    serverSettings.port = url.port;
                    serverSettings.path = url.pathname;

                    send.call( that, serverSettings, message );
                }
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
    @param {String} url - The URL of the Unified Push Server.
    @returns {Object} sender - a Sender Object Event Emitter
 */
AeroGear.Sender = function( url ) {
    if ( !( this instanceof  AeroGear.Sender ) ) {
        return new  AeroGear.Sender( url );
    }

    events.EventEmitter.call( this );

    url += "/rest/sender/";

    this.getUrl = function() {
        return url;
    };
};

util.inherits( AeroGear.Sender, events.EventEmitter );

exports.AeroGear = AeroGear;


/**
    The send Method
    @param {Object} message={} - the message to be passed
    @param {String} [message.alert]
    @param {String} [message.sound]
    @param {String} [message.badge]
    @param {Object} settings={} - the settings to be passed
    @param {String} settings.applicationID - The Application ID
    @param {String} settings.masterSecret - The Master Secret
    @param {Object} [settings.criteria={}] - the criteria to select
    @param {Array} [settings.criteria.alias] - a list of email or name strings
    @param {Array} [settings.criteria.deviceType] - a list of device types as strings
    @param {Array} [settings.criteria.category] - a list of categories as strings
    @param {Array} [settings.criteria.variants] - a list of variantID's as strings
    @param {Object} [settings.criteria.simple-push] - an object containing simple-push criteria
    @returns {Object} itself

 */
AeroGear.Sender.prototype.send = function( message, settings ) {

    settings = settings || {};

    var serverSettings,
        url = urlParser.parse( this.getUrl() ),
        newMessage = {};

    if( settings.criteria ) {
        for( var crit in settings.criteria ) {
            newMessage[ crit ] = settings.criteria[ crit ];
        }
    }

    newMessage.message = message;

    serverSettings = createServerSettings( url, settings );

    send.call( this, serverSettings, newMessage );

    return this;
};
