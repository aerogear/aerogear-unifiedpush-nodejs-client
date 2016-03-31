/* Node.js Sender API for the AeroGear Unified Push server
* https://github.com/aerogear/aerogear-unifiedpush-nodejs-client
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

var request = require("request"),
    util = require( "util" ),
    events = require( "events"),
    _ = require("lodash");

function doEvent( status, message, callback ) {
    if( !callback || typeof callback !== "function" ) {
        this.emit( status, message );
        return;
    }

    if( status === "error" ) {
        callback( message );
    } else {
        callback( null, message );
    }
}

function send( options, message, callback ) {
    var that = this;
    request(options, function (err, response, body) {
        if (err) {
            return doEvent.call( that, "error", "problem with request: " + err.message, callback );
        }

        doEvent.call( that, "success", body, callback );
    });
}

function createServerSettings( url, applicationId, masterSecret, customHeaders, message ) {
    var defaultHeaders = {
        "aerogear-sender": "AeroGear Node.js Sender"
    };
    var serverSettings = {
        uri: url,
        headers: _.extend( {}, defaultHeaders, customHeaders ),
        auth: {
            user: applicationId,
            pass: masterSecret
        },
        json: true,
        body: message,
        method: "POST"
    };
    return serverSettings;
}

function camelToDash( str ) {
    return str.replace( /\W+/g, "-" )
        .replace( /([a-z\d])([A-Z])/g, "$1-$2" ).toLowerCase();
}

function removeEmptyArrays (opt) {
    for (var o in opt) {
        if (Array.isArray(opt[o]) && opt[o].length < 1) {
            delete opt[o];
        }
    }
    return opt;
}

var AeroGear = {};

/**
    The AeroGear.Sender does cool stuff
    @class
    @param {Object} settings={} - the settings to be passed
    @param {String} settings.url - The URL of the Unified Push Server.
    @param {String} settings.applicationId - The Application ID
    @param {String} settings.masterSecret - The Master Secret
    @param {Object} settings.headers - The hash of custom HTTP headers / header overrides
    @returns {Object} sender - a Sender Object Event Emitter
 */
AeroGear.Sender = function( settings ) {
    settings = settings || {};

    if( !settings.url || !settings.applicationId || !settings.masterSecret ) {
        throw "UnifiedPushSenderError";
    }

    if ( !( this instanceof  AeroGear.Sender ) ) {
        return new AeroGear.Sender( settings );
    }

    var url = settings.url;

    events.EventEmitter.call( this );

    url = url.substr(-1) === '/' ? url : url + '/';
    url += "rest/sender/";

    this.getUrl = function() {
        return url;
    };

    this.getApplicationId = function() {
        return settings.applicationId;
    };

    this.getMasterSecret = function() {
        return settings.masterSecret;
    };

    this.getCustomHeaders = function() {
        return settings.headers || {};
    };
};

util.inherits( AeroGear.Sender, events.EventEmitter );

/**
    The send Method
    @param {Object}  message={} - the message to be passed
    @param {String}  [message.alert] - message that will be displayed on the alert UI element
    @param {String}  [message.priority] - sets a processing priority on a push message. values can be 'normal' or 'high'
    @param {String}  [message.sound] - The name of a sound file
    @param {String}  [message.badge] - The number to display as the badge of the app icon
    @param {Object}  [message.userData={}] - any extra user data to be passed
    @param {Object}  [message.apns={}]
    @param {String}  [message.apns.title] - A short string describing the purpose of the notification.
    @param {String}  [message.apns.actionCategory] - the identifier of the action category for the interactive notification
    @param {Boolean} [message.apns.contentAvailable]
    @param {String}  [message.apns.action] - The label of the action button
    @param {Array}   [message.apns.urlArgs] - an array of values that are paired with the placeholders inside the urlFormatString value of your website.json file. Safari Only
    @param {String}  [message.apns.titleLocKey] - The key to a title string in the Localizable.strings file for the current localization. iOS Only
    @param {Array}   [message.apns.titleLocArgs] - Variable string values to appear in place of the format specifiers in title-loc-key. iOS Only
    @param {Object}  [message.windows={}]
    @param {String}  [message.windows.type] - The type of message to send toast, raw, badge or tile.
    @param {String}  [message.windows.duration] - Duration a Toast message is displayed 'long' or 'short'
    @param {String}  [message.windows.badge] - Badge notifications type for badges that are not numbers (none, activity, alert, available, away, busy, newMessage, paused, playing, unavailable, error or attention), for numbers use the value in the main part of the message.
    @param {String}  [message.windows.tileType] - Different type of tile messages with different sizes see the [tile template catalog]{@link https://msdn.microsoft.com/en-us/library/windows/apps/hh761491.aspx} e.g. 'TileSquareText02' or 'TileWideBlockAndText02'
    @param {Array}   [message.windows.images] - Images either local or remote need match the nubmer of the tileType
    @param {Array}   [message.windows.textFields] - Texts needs to be same as the number of the tileType
    @param {String}  [message.simplePush] - simplePush version number
    @param {Object}  options = {} - the options to be passed
    @param {Object}  [options.config={}] - the criteria to select
    @param {Number}  [options.config.ttl] - the time to live in seconds. This value is supported by APNs and GCM Only
    @param {Object}  [options.criteria={}] - the criteria to select
    @param {Array}   [options.criteria.alias] - a list of email or name strings
    @param {Array}   [options.criteria.deviceType] - a list of device types as strings
    @param {Array}   [options.criteria.categories] - a list of categories as strings
    @param {Array}   [options.criteria.variants] - a list of variantID's as strings
    @returns {Object} itself

 */
AeroGear.Sender.prototype.send = function( message, options, callback ) {

    if( options && typeof options === "function" ) {
        callback = options;
        options = undefined;
    }

    options = options || {};

    var serverSettings, option, key, apnsKey,
        newMessage = {};

    // Make sure we remove empty arrays for criteria
    newMessage.criteria = removeEmptyArrays(options.criteria);
    newMessage.config = options.config;

    for( option in options ) {
        if( option !== "criteria" || option !== "config" ) {
            newMessage[ option ] = options[ option ];
        }
    }

    for( key in message ) {
        if ( key === "apns" ) {
            for( apnsKey in message[key]) {
                if( apnsKey === "actionCategory" || apnsKey === "contentAvailable" || apnsKey === "urlArgs" || apnsKey === "titleLocKey" || apnsKey === "titleLocArgs") {
                    message[key][camelToDash(apnsKey)] = message[key][apnsKey];
                    delete message[key][apnsKey];
                }
            }
        }

        if(key === "simplePush" || key === "userData") {
            message[camelToDash(key)] = message[key];
            delete message[key];
        }
    }

    newMessage.message = message;

    serverSettings = createServerSettings( this.getUrl(), this.getApplicationId(), this.getMasterSecret(), this.getCustomHeaders(), newMessage );

    send.call( this, serverSettings, newMessage, callback );

    return this;
};

module.exports = AeroGear;
