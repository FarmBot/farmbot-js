# FarmbotJS: Farmbot RPC wrapper

# Project Status

**Don't use it yet**. Pre-alpha / Not ready for use of any kind.

## TODO

 - [ ] Add build tool / pre built `farmbot.min.js`
 - [ ] **Add support for UMD modules**
 - [ ] Upgrade to support latest MeshBlu
 - [ ] Get off of socket.io after meshblu upgrade.
 - [X] Add test suite
 - [X] Ability to generate guest UUID / Token.
 - [X] Add test coverage reporter
 - [ ] Download REST server URL off of bot on connect (avoids un-DRY configuration)
 - [ ] Get feature parity with old version.

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

var bot = FarmbotJS({uuid: "123", token: "456"});

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

**Commands will be marked with a `*` as they are implemented**

 * emergencyStop*
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
 * togglePin(number)
 * updateCalibration
 * sendRaw(jsObject) (NOT PROMISE BASED- USE `send()`)

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

var bot = FarmbotJS(options);

```

### Timeout (Number)

Time (in milliseconds) to wait before deeming an RPC command to be unacknowledged. Relevant promise objects will be rejected if the bot does not respond in the timeframe provided. Defaults to `1000`.

```javascript

var bot = FarmbotJS({
  uuid: "123",
  token: "456"
})
bot.options.timeout = 5000 // 5 seconds

```
