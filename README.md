[![npm](https://img.shields.io/npm/v/farmbot)](https://www.npmjs.com/package/farmbot?activeTab=versions)
[![ci](https://github.com/FarmBot/farmbot-js/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/FarmBot/farmbot-js/actions?query=branch%3Amain)
[![Coverage Status](https://coveralls.io/repos/github/FarmBot/farmbot-js/badge.svg?branch=main)](https://coveralls.io/github/FarmBot/farmbot-js?branch=main)

# FarmbotJS: Farmbot RPC wrapper

## Browser Support

Works on all _modern_ browsers that were released in the last 12 months.

## NodeJS Support

Independent developers have reported success when using FarmBotJS in a Node environment, but we do not test against Node based setups, nor do we (FarmBot, Inc) use FarmBotJS in a production Node environment. Issue reports related to NodeJS are highly appreciated.

## Installation (NPM)

```bash
npm install farmbot
```

## Installation (Vanilla JS)

```
<script src="https://cdn.jsdelivr.net/npm/farmbot@latest/dist/farmbot_single_file.js"></script>
<script>
  var farmbot123 = new fbjs.Farmbot({ token: "foo.bar.baz" });
</script>
```

## Running the Test Suite (Advanced)


```bash
npm run test
```

## Other Package Managers

Please raise an issue if you require support with other package managers.

## Login with an API Token

Login using your API token from the [Farmbot Web App](http://my.farm.bot).

[Click here for instructions on how to generate an API token.](https://developer.farm.bot/docs/rest-api#section-generating-an-api-token)

### Example:

```javascript

import { Farmbot } from "farmbot";

var SUPER_SECRET_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ0ZXN0MTIzQHRlc3QuY29tIiwiaWF0IjoxNDU5MTA5NzI4LCJqdGkiOiI5MjJhNWEwZC0wYjNhLTQ3NjctOTMxOC0xZTQxYWU2MDAzNTIiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvIiwiZXhwIjoxNDU5NDU1MzI4LCJtcXR0IjoibG9jYWxob3N0IiwiYm90IjoiYWE3YmIzN2YtNWJhMy00NjU0LWIyZTQtNThlZDU3NDY1MDhjIn0.KpkNGR9YH68AF3iHP48GormqXzspBJrDGm23aMFGyL_eRIN8iKzy4gw733SaJgFjmebJOqZkz3cly9P5ZpCKwlaxAyn9RvfjQgFcUK0mywWAAvKp5lHfOFLhBBGICTW1r4HcZBgY1zTzVBw4BqS4zM7Y0BAAsflYRdl4dDRG_236p9ETCj0MSYxFagfLLLq0W63943jSJtNwv_nzfqi3TTi0xASB14k5vYMzUDXrC-Z2iBdgmwAYUZUVTi2HsfzkIkRcTZGE7l-rF6lvYKIiKpYx23x_d7xGjnQb8hqbDmLDRXZJnSBY3zGY7oEURxncGBMUp4F_Yaf3ftg4Ry7CiA";

let bot = new Farmbot({ token: SUPER_SECRET_TOKEN });

bot
  .connect()
  .then(function () {
    return bot.moveRelative({ x: 1, y: 2, z: 3, speed: 100 });
  });

```

# Sending Commands to a Farmbot Object

```javascript

bot
  .connect()
  .then(function(bot){
    console.log("Bot online!");
    return bot.emergencyStop(); // You can chain commands.
  })
  .then(function(bot){
    console.log("Bot has stopped!");
  })
  .catch(function(error) {
    console.log("Something went wrong :(");
  });

```

## Basic RPC Commands

Call RPC commands using the corresponding method on `bot`. All RPC commands return a promise.

### Example:

```javascript

bot
  .home({ axis: "x", speed: 800 })
  .then(function (ack) {
    console.log("X Axis is now at 0.");
  })
  .catch(function (err) {
    console.log("Failed to bring X axis home.");
  })

```

### Currently supported commands:

[See the annotated type definitions for available methods and properties.](https://github.com/FarmBot/farmbot-js/blob/main/dist/farmbot.d.ts)

## Using Events

```javascript
  var bot = Farmbot({ token: '---'});
  bot.on("eventName", function(data, eventName) {
    console.log("I just got an" + eventName + " event!");
    console.log("This is the payload: " + data);
  })
   // "I just got an eventName event!"
   // "This is the payload: any javascript object or primitive"
  bot.emit("eventName", "any javascript object or primitive");
  var eventHandlers = bot.event("eventName");
   // [function(){...}]
```

## Routine Events

 * `"status"`: Most important. When the REMOTE device state changes (eg: "x" goes from 0 to 100), the bot will emit this event.
 * `"logs"`: The bot will send logs to this channel.
 * `"offline"`: Connection lost. **Note: FarmbotJS will try to auto-reconnect**.
 * `"online"`: Client is connected and subscribed to bot.
 * `"sent"`: Triggered when the application begins sending a message.
 * `"sync"`: A resource on the API has changed.

## Special Events

 * `<random uuid>`: RPC commands have UUIDs when they leave the browser. When the bot responds to that message, FarmbotJS will emit an event named after the request's UUID. Mostly for internal use.
 * `"malformed"`: When the bot gets a bad RPC command, it will notify you via this channel.
 * `*`: Catch all events (for debugging).

# Q: Where do I report security issues?

We take security seriously and value the input of independent researchers. Please see our [responsible disclosure guidelines](https://farm.bot/responsible-disclosure-of-security-vulnerabilities/).
