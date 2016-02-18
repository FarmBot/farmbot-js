
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.Farmbot = factory();
  }
}(this, function(require, exports, module) {

return (function(global) {
  'use strict';

  Farmbot.prototype.emergencyStop = function() {
    return this.send({
      params: {},
      method: "single_command.EMERGENCY STOP"
    });
  }

  // TODO create a `sequence` constructor that validates and enforces inputs, to
  // avoid confusion.
  Farmbot.prototype.execSequence = function(sequence) {
    return this.send({
      params: sequence,
      method: "exec_sequence"
    });
  }

  Farmbot.prototype.homeAll = function(opts) {
    Farmbot.requireKeys(opts, ["speed"]);
    return this.send({
      params: opts,
      method: "single_command.HOME ALL"
    });
  }

  Farmbot.prototype.homeX = function(opts) {
    Farmbot.requireKeys(opts, ["speed"]);
    return this.send({
      params: opts,
      method: "single_command.HOME X"
    });
  }

  Farmbot.prototype.homeY = function(opts) {
    Farmbot.requireKeys(opts, ["speed"]);
    return this.send({
      params: opts,
      method: "single_command.HOME Y"
    });
  }

  Farmbot.prototype.homeZ = function(opts) {
    Farmbot.requireKeys(opts, ["speed"]);
    return this.send({
      params: opts,
      method: "single_command.HOME Z"
    });
  }


  Farmbot.prototype.moveAbsolute = function(opts) {
    Farmbot.requireKeys(opts, ["speed"]);
    return this.send({
      params: opts,
      method: "single_command.MOVE ABSOLUTE"
    });
  }

  Farmbot.prototype.moveRelative = function(opts) {
    Farmbot.requireKeys(opts, ["speed"]);
    return this.send({
      params: opts,
      method: "single_command.MOVE RELATIVE"
    });
  }

  Farmbot.prototype.pinWrite = function(opts) {
    Farmbot.requireKeys(opts, ["pin", "value1", "mode"]);
    return this.send({
      params: opts,
      method: "single_command.PIN WRITE"
    });
  }

  Farmbot.prototype.readStatus = function() {
    return this.send({
      params: {},
      method: "read_status"
    });
  }

  Farmbot.prototype.syncSequence = function() {
    console.warn("Not yet implemented");
    return this.send({
      params: {},
      method: "sync_sequence"
    });
  }

  Farmbot.prototype.updateCalibration = function(params) {
    // Valid keys for `params` object: movement_timeout_x, movement_timeout_y,
    // movement_timeout_z, movement_invert_endpoints_x,
    // movement_invert_endpoints_y, movement_invert_endpoints_z,
    // movement_invert_motor_x, movement_invert_motor_y, movement_invert_motor_z,
    // movement_steps_acc_dec_x, movement_steps_acc_dec_y,
    // movement_steps_acc_dec_z, movement_home_up_x, movement_home_up_y,
    // movement_home_up_z, movement_min_spd_x, movement_min_spd_y,
    // movement_min_spd_z, movement_max_spd_x, movement_max_spd_y,
    // movement_max_spd_z
    return this.send({ params: params || {}, method: "update_calibration" });
  }

  Farmbot.config = {
    requiredOptions: ["uuid", "token", "meshServer", "timeout"],
    defaultOptions: {
      speed: 100,
      meshServer: 'meshblu.octoblu.com',
      timeout: 6000
    }
  }

  Farmbot.prototype.event = function(name) {
    this.__events = this.__events || {};
    this.__events[name] = this.__events[name] || [];
    return this.__events[name];
  };

  Farmbot.prototype.on = function(event, callback) {
    this.event(event).push(callback);
  };

  Farmbot.prototype.emit = function(event, data) {
    [this.event(event), this.event('*')]
      .forEach(function(handlers) {
        handlers.forEach(function(handler) {
          try {
            handler(data, event);
          } catch(e){
            console.warn("Exception thrown while handling `" + event + "` event.");
          }
        })
      });
  }

  Farmbot.prototype.buildMessage = function(input) {
    var msg = input || {};
    var metaData = {
      devices: (msg.devices || this.getState("uuid")),
      id: (msg.id || Farmbot.uuid())
    };
    Farmbot.extend(msg, [metaData]);
    Farmbot.requireKeys(msg, ["params", "method", "devices", "id"]);
    return msg;
  };

  Farmbot.prototype.sendRaw = function(input) {
    if (this.socket) {
      var msg = this.buildMessage(input);
      this.socket.send(JSON.stringify(["message", msg]));
      return msg;
    } else {
      throw new Error("You must connect() before sending data");
    };
  };

  Farmbot.prototype.send = function(input) {
    var that = this;
    var msg = that.sendRaw(input);
    var errMsg = msg.method + " " + JSON.stringify(msg.params);
    var timeOut = that.getState("timeout");
    var promise = Farmbot.timerDefer(timeOut, errMsg);
    that.on(msg.id, function(response) {
      var respond = (response && response.result) ? promise.resolve : promise.reject;
      respond(response);
    })
    return promise
  };

  Farmbot.prototype.__newSocket = function() { // for easier testing.
    return new WebSocket("ws://" + this.getState("meshServer") + "/ws/v2");
  };

  Farmbot.prototype.__onclose = function() {
    delete this.socket;
    this.emit('disconnect', this);
  };

  Farmbot.prototype.__onmessage = function(e) {
    var msg = Farmbot.decodeFrame(e.data);
    var nullMessage = {name: "unknown", message: {}};
    var id = (msg.message || nullMessage).id;
    if (id) {
      this.emit(id, msg.message);
    } else {
      this.emit(msg.name, msg.message);
    };
  };

  Farmbot.prototype.__newConnection = function(credentials) {
    var that = this;
    var promise = Farmbot.timerDefer(that.getState("timeout"), "__newConnection");
    var socket = that.__newSocket();

    socket.onopen = function() {
      socket.send(Farmbot.encodeFrame("identity", credentials));
    };
    socket.onmessage = that.__onmessage.bind(that);
    socket.onclose = that.__onclose.bind(that);
    that.on("ready", function() {
      that.socket = socket;
      promise.resolve(that)
    });
    return promise;
  }

  Farmbot.prototype.connect = function() {
    var bot = this;
    var $p = Farmbot.timerDefer(bot.getState("timeout"), "subscribing to device");

    function subscribe() {
      bot.socket.send(Farmbot.encodeFrame("subscribe", bot));
      $p.resolve(bot); // TODO is there a way to confirm "subscribe" success?
    }

    return Farmbot.registerDevice()
            .then(function(credentials) {
              return bot.__newConnection(credentials);
            })
            .then(subscribe);
  }

  // a convinience promise wrapper.
  Farmbot.defer = function(label) {
    var $reject, $resolve;
    var that = new Promise(function(resolve, reject) {
      $reject = reject;
      $resolve = resolve;
    });
    that.finished = false
    that.reject = function() {
      that.finished = true;
      $reject.apply(that, arguments);
    }
    that.resolve = function() {
      that.finished = true;
      $resolve.apply(that, arguments);
    }
    that.label = label || "a promise";
    return that;
  };

  Farmbot.timerDefer = function(timeout, label) {
    label = label || ("promise with " + timeout + " ms timeout");
    var that = Farmbot.defer(label);
    if(!timeout) { throw new Error("No timeout value set."); };
    setTimeout(function() {
      if (!that.finished) {
        var failure = new Error("`" + label + "` did not execute in time");
        that.reject(failure);
      };
    }, timeout);
    return that;
  };

  Farmbot.encodeFrame = function(name, payload) {
    return JSON.stringify([name, payload]);
  };

  Farmbot.decodeFrame = function(frameString) {
    var raw = JSON.parse(frameString)
    return {
      name: raw[0],
      message: raw[1]
    }
  };

  Farmbot.__newXHR = function(timeOut, meshUrl){
    var meshUrl = meshUrl || '//meshblu.octoblu.com';
    var timeOut = timeOut || Farmbot.config.defaultOptions.timeout;
    var request = new XMLHttpRequest();
    request.open('POST', meshUrl + '/devices?type=farmbotjs_client', true);
    return request;
  }

  Farmbot.registerDevice = function(timeOut, meshUrl) {
    var timeOut = timeOut || Farmbot.config.defaultOptions.timeout;
    var request = Farmbot.__newXHR(timeOut, meshUrl);
    var promise = Farmbot.timerDefer(timeOut, "Registeration of device");
    request.onload = function(data) {
      if (request.status >= 200 && request.status < 400) {
        return promise.resolve(JSON.parse(request.responseText))
      } else {
        return promise.reject(data);
      };
    };

    request.onerror = promise.reject
    request.send();
    return promise;
  }

  Farmbot.extend = function(target, mixins) {
    mixins.forEach(function(mixin) {
      var iterate = function(prop) {
        target[prop] = mixin[prop];
      };
      Object.keys(mixin).forEach(iterate);
    });
    return target;
  };


  Farmbot.requireKeys = function(input, required) {
    required.forEach(function(prop) {
      var val = input[prop];
      if (!val && (val !== 0)) { // FarmbotJS considers 0 to be truthy.
        throw (new Error("Expected input object to have `" + prop +
          "` property"));
      }
    });
  };

  Farmbot.uuid = function() {
    var template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    var replaceChar = function(c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    };
    return template.replace(/[xy]/g, replaceChar);
  };

  // This function isn't clever enough.
  Farmbot.token = function() {
    var randomHex = function() {
      var num = (1 + Math.random()) * 0x10000;
      return Math.floor(num).toString(16).substring(1);
    }
    var i = 10;
    var results = [];
    while (i--) {
      results.push(randomHex());
    }
    return results.join('');
  };

  Farmbot.MeshErrorResponse = function(input) {
    return {
      error: {
        method: "error",
        error: input || "unspecified error"
      }
    }
  }

  function Farmbot(input) {
    if (!(this instanceof Farmbot)) {
      return new Farmbot(input);
    }

    var state = {};
    Farmbot.extend(state, [Farmbot.config.defaultOptions, input]);
    Farmbot.requireKeys(state, Farmbot.config.requiredOptions);
    this.listState = function() { return Object.keys(state); }
    this.getState = function(key) { return state[key]; }
    this.setState = function(key, val) {
      if (val !== state[key]) {
        var old = state[key];
        state[key] = val;
        this.emit("change", { name: key, value: val, oldValue: old });
      };
      return val;
    }
  }

  return Farmbot
})(this);
;

}));
