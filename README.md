# AeroGear UnifiedPush Node.js Client

[![CircleCI](https://img.shields.io/circleci/project/github/aerogear/aerogear-unifiedpush-nodejs-client/master.svg)](https://circleci.com/gh/aerogear/aerogear-unifiedpush-nodejs-client) 
[![Coverage Status](https://img.shields.io/coveralls/github/aerogear/aerogear-unifiedpush-nodejs-client.svg)](https://coveralls.io/github/aerogear/aerogear-unifiedpush-nodejs-client)
[![npm](https://img.shields.io/npm/v/unifiedpush-node-sender.svg)](https://www.npmjs.com/package/unifiedpush-node-sender)
[![License](https://img.shields.io/badge/-Apache%202.0-blue.svg)](https://opensource.org/s/Apache-2.0)

Node Sender API for the AeroGear Unified Push server

> This version of the sender is compatible with the 1.1.x series of the UnifiedPush Server_

|                          | Project Info                                            |
| ------------------------ | ------------------------------------------------------- |
| License:                 | Apache License, Version 2.0                             |
| Build:                   | npm                                                     |
| End User Documentation:  | https://docs.aerogear.org                               |
| Community Documentation: | https://aerogear.org                                    |
| Issue tracker:           | https://issues.jboss.org/browse/AEROGEAR                |
| Mailing lists:           | https://groups.google.com/forum/#!forum/aerogear        |

## Getting Started

Add the dependency to your project:

```bash
npm i unifiedpush-node-sender
```

## Usage

Create a sender

```javascript
const agSender = require('unifiedpush-node-sender');

const settings = {
    url: '<pushServerURL e.g http(s)//host:port/context>',
    applicationId: '<pushApplicationId e.g. 1234456-234320>',
    masterSecret: '<masterSecret e.g. 1234456-234320>'
};
```    

First get a handle on the `client` object, then use the `client.sender.send` method to send a message

```javascript
agSender(settings).then((client) => {
    client.sender.send(message, options).then((response) => {
        console.log('success', response);
    })
});
```    

Similar to the `send` method but passing an array of `{message, options}` objects as parameter instead.

```javascript
agSender(settings).then((client) => {
    client.sender.sendBatch(messages).then((response) => {
        console.log('success', response);
    })
});
```

## API Documentation

### Class: Sender

The Sender Class, It returns a Promise with the `client` object

### Sender(settings)

* `settings` Object
    * `url` String - The URL of the Unified Push Server.
    * `applicationId` String - The id of an Application from the Unified Push Server
    * `masterSecret` String - The master secret for that Application
    * `headers` Object - The hash of custom HTTP headers / header overrides

### client.sender.send([message], [options])

* `message` Object
    * `alert` String - message that will be displayed on the alert UI element
    * `priority` String - sets a processing priority on a push message. values can be 'normal' or 'high'
    * `sound` String - The name of a sound file
    * `badge` String - The number to display as the badge of the app icon
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

## License 

See [LICENSE file](./LICENSE.txt)

## Questions?

Join our [user mailing list](https://groups.google.com/forum/#!forum/aerogear) for any questions or help! We really hope you enjoy app development with AeroGear.

## Found a bug?

If you found a bug please create a ticket for us on [Jira](https://issues.jboss.org/browse/AEROGEAR) with some steps to reproduce it.
