# unifiedpush-node-sender [![Build Status](https://secure.travis-ci.org/aerogear/aerogear-unifiedpush-nodejs-client.png?branch=master)](https://travis-ci.org/aerogear/aerogear-unifiedpush-nodejs-client)

Node Sender API for the AeroGear Unified Push server

_note: This version of the sender is compatible with the 1.1.x series of the UnifiedPush Server_

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

## API Documentation

### Class: Sender

The Sender Class,  It is an `EventEmitter`

### new Sender(settings)

* `settings` Object
    * `url` String - The URL of the Unified Push Server.
    * `applicationId` String - The id of an Application from the Unified Push Server
    * `masterSecret` String - The master secret for that Application
    * `headers` Object - The hash of custom HTTP headers / header overrides

### sender.send([message], [options], [callback])

* `message` Object
    * `alert` String - message that will be displayed on the alert UI element
    * `priority` String - sets a processing priority on a push message. values can be 'normal' or 'high'
    * `sound` String - The name of a sound file
    * `badge` String - The number to display as the badge of the app icon
    * `simplePush` String - simplePush version number
    * `userData` Object - any extra user data to be passed

* `message.apns` Object
    * `title` String - A short string describing the purpose of the notification.
    * `action` String - The label of the action button
    * `urlArgs` Array - an array of values that are paired with the placeholders inside the urlFormatString value of your website.json file. Safari Only
    * `titleLocKey` String - The key to a title string in the Localizable.strings file for the current localization. iOS Only
    * `titleLocArgs` Array - Variable string values to appear in place of the format specifiers in title-loc-key. iOS Only
    * `actionCategory` String - the identifier of the action category for the interactive notification
    * `contentAvailable` Boolean - Provide this key with a value of 1 to indicate that new content is available. iOS Only

* `message.windows` Object
    * `type` String - The type of message to send toast, raw, badge or tile.
    * `duration` String - Duration a Toast message is displayed 'long' or 'short'
    * `badge` String - Badge notifications type for badges that are not numbers (none, activity, alert, available, away, busy, newMessage, paused, playing, unavailable, error or attention), for numbers use the value in the main part of the message.
    * `tileType` String - Different type of tile messages with different sizes see the [tile template catalog]{@link https://msdn.microsoft.com/en-us/library/windows/apps/hh761491.aspx} e.g. 'TileSquareText02' or 'TileWideBlockAndText02'
    * `images` Array - Images either local or remote need match the nubmer of the tileType
    * `textFields` Array - Texts needs to be same as the number of the tileType

* `options` Object

* `options.config` Object
    * `ttl` Number - the time to live in seconds. This value is supported by APNs and GCM Only

* `options.criteria` Object
    * `alias` Array - a list of email or name strings
    * `deviceType` Array - a list of device types as strings
    * `categories` Array - a list of categories as strings
    * `variants` Array - a list of variantID's as strings

* `callback` Function


### Event: 'success'

`function () { }`

### Event: 'error'

`function (error) { }`

For more information about the Unified Push Server's REST sender API, look [here](https://aerogear.org/docs/specs/aerogear-unifiedpush-rest/sender/index.html)

## Development

If you would like to help develop AeroGear you can join our [developer's mailing list](https://lists.jboss.org/mailman/listinfo/aerogear-dev), join #aerogear on Freenode, or shout at us on Twitter @aerogears.

Also takes some time and skim the [contributor guide](http://aerogear.org/docs/guides/Contributing/)

#### Generate Documentation

The code is documented in JSDoc and can be generated in `docs` folder by running:

`npm run-script docs`

## Questions?

Join our [user mailing list](https://lists.jboss.org/mailman/listinfo/aerogear-users) for any questions or help! We really hope you enjoy app development with AeroGear!

## Found a bug?

If you found a bug please create a ticket for us on [Jira](https://issues.jboss.org/browse/AGPUSH) with some steps to reproduce it.
