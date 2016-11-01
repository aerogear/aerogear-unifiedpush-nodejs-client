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
'use strict';

/**
* @module unifiedpush-node-sender
*/

const privateMap = require('./private-map');
const sender = require('./sender');

/**
    Create a new UnifiedPush sender client. It does cool stuff
    @param {Object} settings={} - the settings to be passed
    @param {String} settings.url - The URL of the Unified Push Server.
    @param {String} settings.applicationId - The Application ID
    @param {String} settings.masterSecret - The Master Secret
    @param {Object} settings.headers - The hash of custom HTTP headers / header overrides
    @instance
    @returns {Promise} A promise that will resolve with the client object.
*/
function unifiedPushSenderClient(settings) {
    settings = settings || {};


    if(!settings.url || !settings.applicationId || !settings.masterSecret) {
        return Promise.reject('settings must contain valid url, applicationId, and masterSecret');
    }

    const client = {
        sender: {}
    };

    for(let func in sender) {
        client.sender[func] = sender[func](client);
    }

    client.url = (settings.url.substr(-1) === '/') ? `${settings.url}rest/sender/` : `${settings.url}/rest/sender/`;

    // A WeakMap reference to our private data
    // means that when all references to 'client' disappear
    // then the entry will be removed from the map
    privateMap.set(client, settings);

    return Promise.resolve(client);
}

module.exports = unifiedPushSenderClient;
