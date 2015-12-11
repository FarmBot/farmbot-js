# FarmbotJS: Farmbot RPC wrapper

# Project Status

**Public Alpha**. Were using it in the next version of the Farm Designer and are stabilizing the API as we go. API may change without notice, but is mostly functional.

## Browser Support

Works on any browser that supports:

 * [Native Promise objects](http://caniuse.com/#feat=promises).
 * [Websockets](http://caniuse.com/#feat=websockets).

## Installation (Library Users)

```
npm install farmbot
```

Raise an issue if you require support with other package managers such as Bower.

## Quick Usage:

If you are running your bot off of the [officially supported service](http://my.farmbot.io), then all you need to pass in is the UUID/Token of your device.

```javascript

var bot = Farmbot({uuid: "123", token: "456"});

bot
  .connect()
  .then(function(bot){
    alert("Bot online!");
    bot.emergencyStop(); // You can chain commands.
  })
  .then(function(bot){
    alert("Bot has stopped!");
  })
  .catch(function(error) {
    alert("Something went wrong :(");
  });

```

To run it off of a private server, you will need to change the `meshServer` url first:

```javascript
var bot = Farmbot({uuid: "123", token: "456", meshServer: "//myMeshBluServer.org"});
```

## Installation (Library Developers)

 1. `git clone https://github.com/FarmBot/farmbot-js`
 2. `cd farmbot-js`
 3. `npm install` or `sudo npm install` if required

To run tests: `npm test`

To minify and convert to a [UMD module](https://github.com/umdjs/umd): `gulp build`

## Basic RPC Commands

Call RPC commands using the corresponding method on `bot`. All RPC commands return a promise. Timeout is set at `1000 ms` by default and can be reconfigured by changing the bot `timeout` propery on instantiation or via `bot.setState("timeout", 999)`.

Example:

```javascript

  bot
    .home_x()
    .then(function(ack){
      console.log("X Axis is now at 0.");
    })
    .catch(function(err){
      console.log("Failed to bring X axis home.");
    })

```

Currently supported commands:

 * emergencyStop
 * execSequence
 * homeAll
 * homeX
 * homeY
 * homeZ
 * moveAbsolute({x:, y:, z:})
 * moveRelative({x:, y:, z:})
 * pinWrite(num, val, mode)
 * readStatus
 * send(commandObject)
 * syncSequence
 * updateCalibration
 * send(messageObject)
 * sendRaw(jsObject) (NOT PROMISE BASED- consider using `send()` instead.)

## Using Events

```
  var bot = Farmbot({uuid: '---', token: '---'});
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

## Common Events

 * `*`: Catch all events (for debugging).
 * `ready`: Client is connected and subscribed to bot.
 * `disconnect`: Connection lost. **Note: FarmbotJS won't auto-reconnect**.
 * `message`: When the bot gets a *non-rpc* command, it is regarded as a 'message'.
 * `change`: The bot object's internal state has changed.
 * `<random uuid>`: RPC commands have UUIDs when they leave the browser. When the bot responds to that message, FarmbotJS will emit an event named after the request's UUID. Mostly for internal use.

## Internal State and Config

The bot object keeps all state in one place for sanity. This includes things like configuration options, current position, etc. All updates to the bot's state are broadcast with a `change` event, that reports current and previous state value as it changes.

 * `bot.listState()`: See all relevant state record names.
 * `bot.getState(attribute_name)`: Fetch a state record such as `timeout` or `meshServer` URL.
 * `bot.setState(name, value)`: Set state value 'x' to 'y'. Ex: `bot.setState('uuid', '---')`. Emits a `change` event.

## Common Config Options

If you are running your own servers, you may want to use other options.

### meshServer (String)

URL for the mesh server used by the bot. Defaults to `ws://mesh.farmbot.io`.

```javascript

var options = {
  uuid: "123",
  token: "456",
  meshServer: 'wss://localhost:443'
};

var bot = Farmbot(options);

```

### Timeout (Number)

Time (in milliseconds) to wait before deeming an RPC command to be unacknowledged. Relevant promise objects will be rejected if the bot does not respond in the timeframe provided. Defaults to `1000`.

```javascript

var bot = Farmbot({
  uuid: "123",
  token: "456"
})
bot.options.timeout = 5000 // 5 seconds

```

## TODO

 - [ ] Get feature parity with old version.
 - [ ] Convert hardcoded strings, "magic numbers" and event names to constants.
 - [ ] Get compliant with A+ promise spec.
 - [ ] Download REST server URL off of bot on connect (avoids un-DRY configuration)
 - [ ] Convert library to literate javascript?
 - [X] Add getState() amd getState(key) function
 - [X] Add setState(key, value) function
 - [X] Add support for UMD modules
 - [X] Add build tool / pre built `farmbot.min.js`
 - [X] Get off of socket.io after meshblu upgrade.
 - [X] Upgrade to support latest MeshBlu
 - [X] DRY up repetitious promise code via helper in `Farmbot.util`
 - [X] Ability to generate guest UUID / Token.
 - [X] Add test suite
 - [X] Add test coverage reporter

