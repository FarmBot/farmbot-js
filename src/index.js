DeviceService = (function() {
  "use strict"

  function DeviceService() {
    this.initConnections();
  }

  function pushError(error) {
    this.errors.push(error);
  };

  DeviceService.prototype.handleMsg = function(data) {
    return this.Router.route(data, this);
  };

  DeviceService.prototype.connectToMeshBlu = function() {
        // @socket.on 'connect', =>
        //   @syncStatus = 'sync_now'
        //   @socket.on 'message', @handleMsg
        //   @socket.on 'identify', (data) =>
        //     @socket.emit 'identity',
        //       socketid: data.socketid
        //       uuid: "73425170-2660-49de-acd9-6fad4989aff6"
        //       token: "bcbd352aaeb9b7f18214a63cb4f3b16b89d8fd24"
        //     @socket.emit 'subscribe',
        //       uuid: @uuid, token: @token,
        //       (data) => @send "read_status"
      };
    })(this));
  };

  DeviceService.prototype.togglePin = function(number, cb) {
    switch (this["pin" + number]) {
      case 'on':
        return this.send("pin_write", {
          pin: number,
          value1: 0,
          mode: 0
        });
      case 'off':
        return this.send("pin_write", {
          pin: number,
          value1: 1,
          mode: 0
        });
      default:
        return opps();
    }
  };

  DeviceService.prototype.moveRel = function(x, y, z) {
    return this.send("move_relative", {
      x: x,
      y: y,
      z: z
    });
  };

  DeviceService.prototype.moveAbs = function(x, y, z) {
    return this.send("move_absolute", {
      x: x,
      y: y,
      z: z
    });
  };

  DeviceService.prototype.stop = function() {
    return this.send("emergency_stop");
  };

  DeviceService.prototype.fetchLogs = function(cb) {
    return this.socket.emit('getdata', {
      uuid: this.uuid,
      token: this.token,
      limit: 10
    }, function(d) {
      if (d.result === false) {
        return alert('Ensure you have entered the correct token for your FarmBot');
      } else {
        return cb(d);
      }
    });
  };

  DeviceService.prototype.send = function(msg, body) {
    var cmd, stringy_method, uuid;
    if (body == null) {
      body = {};
    }
    if (!this.socket.connected()) {
      return opps();
    }
    uuid = function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r, v;
        r = Math.random() * 16 | 0;
        v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
      });
    };
    cmd = this.Command.create(msg, body);
    if (cmd.command && cmd.command.action) {
      stringy_method = "" + (cmd.message_type || 'undefined');
      stringy_method += "." + cmd.command.action;
    } else {
      stringy_method = msg;
    }
    return this.socket.emit("message", {
      devices: this.uuid,
      params: _.omit(cmd.command, "action"),
      method: stringy_method,
      id: uuid()
    });
  };

  return DeviceService;

})();
