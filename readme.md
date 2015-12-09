# FarmbotJS: Farmbot RPC wrapper

# Project Status

**Don't use it yet**. Pre-alpha / Not ready for use of any kind.

## TODO

 - [ ] Add setState(key, value) function
 - [ ] Add getState() amd getState(key) function
 - [ ] Add build tool / pre built `farmbot.min.js`
 - [ ] **Add support for UMD modules**
 - [ ] Get compliant with A+ promise spec.
 - [ ] Get feature parity with old version.
 - [ ] Download REST server URL off of bot on connect (avoids un-DRY configuration)
 - [ ] Convert hardcoded strings, "magic numbers" and event names to constants.
 - [X] Get off of socket.io after meshblu upgrade.
 - [X] Upgrade to support latest MeshBlu
 - [X] DRY up repetitious promise code via helper in `Farmbot.util`
 - [X] Ability to generate guest UUID / Token.
 - [X] Add test suite
 - [X] Add test coverage reporter

## Prerequisites

Works on any browser that supports:

 * Native Promise objects (you can polyfill this one).
 * Has socketio (will remove dependency in future release)

## Installation

```
npm install farmbotjs
```

If you would like support for other package managers, feel free to submit a PR or raise an issue.

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

See "Advanced Usage and Config" for advanced use cases such as running a private server.

## Basic RPC Commands

Call RPC commands using the corresponding method on `bot`. Most (all?) RPC commands return a promise. Timeout is set at `1000 ms` by default and can be reconfigured by passing in a `timeout` propery on instantiation.

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
 * sendRaw(jsObject) (NOT PROMISE BASED- USE `send()`)

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

 * `*`: Catch all event. Mostly for debugging.
 * `ready`: Client is connected and subscribed to bot.
 * `disconnect`: Connection lost. **Note: FarmbotJS won't auto-reconnect**.
 * `message`: When the bot gets a *non-rpc* command, it is regarded as a 'message'.

## Advanced Usage and Config

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
