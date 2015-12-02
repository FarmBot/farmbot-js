# FarmbotJS: Farmbot RPC wrapper

# Project Status

**Don't use it yet**. Pre-alpha / Not ready for use of any kind.

## TODO

 - [ ] Add build tool / pre built `farmbot.min.js`
 - [ ] **Add support for UMD modules**
 - [X] Add test suite
 - [ ] Need ability to generate guest UUID / Token.
 - [ ] Add test coverage reporter
 - [ ] Download REST server URL off of bot on connect (avoids un-DRY configuration)
 - [ ] Get feature parity with old version.

## Prerequisites

Works on any browser that supports:

 * Native Promise objects (you can polyfill this one).
 * Native Websockets (we don't plan on supporting polyfills).

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
  .then(function(bot){ alert("Bot online!"); })
  .catch(function(error) { alert("Opps! Couldnt connect :("); });

```

See "Advanced Usage and Config" for advanced use cases such as running a private server.

## Basic RPC Commands

Call RPC commands using the corresponding method on `bot.commands`. Most (all?) RPC commands return a promise. Timeout is set at `1000 ms`

Example:

```javascript

  bot
    .commands
    .home_x()
    .then(function(ack){
      console.log("X Axis is now at 0.");
    })
    .catch(function(err){
      console.log("Failed to bring X axis home.");
    })

```

Currently supported commands:

 * emergency_stop
 * exec_sequence
 * home_all
 * home_x
 * home_y
 * home_z
 * move_absolute({x:, y:, z:})
 * move_relative({x:, y:, z:})
 * pin_write(num, val, mode)
 * read_status
 * send_raw(jsObject)
 * sync_sequence (Rename to `syncronize`? Comments welcome.)
 * togglePin(number)
 * update_calibration

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
