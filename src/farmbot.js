(function(global) {
  'use strict';

  Fb.prototype.emergencyStop = function() {
    return this.send({
      params: {},
      method: "single_command.EMERGENCY STOP"
    });
  }

  // TODO create a `sequence` constructor that validates and enforces inputs, to
  // avoid confusion.
  Fb.prototype.execSequence = function(sequence) {
    return this.send({
      params: sequence,
      method: "exec_sequence"
    });
  }

  Fb.prototype.homeAll = function(opts) {
    Fb.requireKeys(opts, ["speed"]);
    return this.send({
      params: opts,
      method: "single_command.HOME ALL"
    });
  }

  Fb.prototype.homeX = function(opts) {
    Fb.requireKeys(opts, ["speed"]);
    return this.send({
      params: opts,
      method: "single_command.HOME X"
    });
  }

  Fb.prototype.homeY = function(opts) {
    Fb.requireKeys(opts, ["speed"]);
    return this.send({
      params: opts,
      method: "single_command.HOME Y"
    });
  }

  Fb.prototype.homeZ = function(opts) {
    Fb.requireKeys(opts, ["speed"]);
    return this.send({
      params: opts,
      method: "single_command.HOME Z"
    });
  }


  Fb.prototype.moveAbsolute = function(opts) {
    Fb.requireKeys(opts, ["speed"]);
    return this.send({
      params: opts,
      method: "single_command.MOVE ABSOLUTE"
    });
  }

  Fb.prototype.moveRelative = function(opts) {
    Fb.requireKeys(opts, ["speed"]);
    return this.send({
      params: opts,
      method: "single_command.MOVE RELATIVE"
    });
  }

  Fb.prototype.pinWrite = function(values) {
    Fb.requireKeys(opts, ["pin", "value1", "mode"]);
    return this.send({
      params: opts,
      method: "single_command.PIN WRITE"
    });
  }

  Fb.prototype.readStatus = function() {
    return this.send({
      params: {},
      method: "read_status"
    });
  }

  Fb.prototype.syncSequence = function() {
    console.warn("Not yet implemented");
    return this.send({
      params: {},
      method: "sync_sequence"
    });
  }

  Fb.prototype.updateCalibration = function() {
    console.warn("Not yet implemented");
    return this.send({
      params: {},
      method: "update_calibration"
    });
  }

  Fb.config = {
    requiredOptions: ["uuid", "token", "meshServer", "timeout"],
    defaultOptions: {
      speed: 100,
      meshServer: 'meshblu.octoblu.com',
      timeout: 5000
    }
  }

  Fb.prototype.event = function(name) {
    this.__events = this.__events || {};
    this.__events[name] = this.__events[name] || [];
    return this.__events[name];
  };

  Fb.prototype.on = function(event, callback) {
    this.event(event).push(callback);
  };

  Fb.prototype.emit = function(event, data) {
    [this.event(event), this.event('*')]
      .forEach(function(handlers) {
        handlers.forEach(function(handler) {
          handler(data, event);
        })
      });
  }

  Fb.prototype.buildMessage = function(input) {
    var msg = input || {};
    var metaData = {
      devices: (msg.devices || this.options.uuid),
      id: (msg.id || Fb.uuid())
    };
    Fb.extend(msg, [metaData]);
    Fb.requireKeys(msg, ["params", "method", "devices", "id"]);
    return msg;
  };

  Fb.prototype.sendRaw = function(input) {
    if (this.socket) {
      var msg = this.buildMessage(input);
      this.socket.send(JSON.stringify(["message", msg]));
      return msg;
    } else {
      throw new Error("You must connect() before sending data");
    };
  };

  Fb.prototype.send = function(input) {
    var that = this;
    var msg = that.sendRaw(input);
    var promise = Fb.timerDefer(that.options.timeout,
      msg.method + " " + msg.params);
    that.on(msg.id, function(response) {
      var respond = (response && response.result) ? promise.resolve : promise.reject;
      respond(response);
    })
    return promise
  };

  Fb.prototype.__newSocket = function() { // for easier testing.
    return new WebSocket("ws://" + this.options.meshServer + "/ws/v2");
  };

  Fb.prototype.__onclose = function() {
    this.emit('disconnect', this);
  };

  Fb.prototype.__onmessage = function(e) {
    var msg = Fb.decodeFrame(e.data);
    var id = msg.message.id;
    if (id) {
      this.emit(id, msg.message);
    } else {
      this.emit(msg.name, msg.message);
    };
  };

  Fb.prototype.__newConnection = function(credentials) {
    var that = this;
    var promise = Fb.timerDefer(that.options.timeout,
      "__newConnection");
    that.socket = that.__newSocket();
    that.socket.onopen = function() {
      that.socket.send(Fb.encodeFrame("identity", credentials));
    };
    that.socket.onmessage = that.__onmessage.bind(that);
    that.socket.onclose = that.__onclose.bind(that);
    that.on("ready", function() {
      promise.resolve(that)
    });
    return promise;
  }

  Fb.prototype.connect = function() {
    var bot = this;
    var $p = Fb.timerDefer(bot.options.timeout, "subscribing to device");

    function subscribe() {
      bot.socket.send(Fb.encodeFrame("subscribe", bot));
      $p.resolve(bot); // TODO is there a way to confirm "subscribe" success?
    }

    return Farmbot
      .registerDevice()
      .then(bot.__newConnection.bind(bot))
      .then(subscribe);
  }

  // a convinience promise wrapper.
  Fb.defer = function(label) {
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

  Fb.timerDefer = function(timeout, label) {
    label = label || ("promise with " + timeout + " ms timeout");
    var that = Fb.defer(label);
    setTimeout(function() {
      if (!that.finished) {
        var failure = new Error("`" + label + "` did not execute in time");
        that.reject(failure);
      };
    }, timeout);
    return that;
  };

  Fb.encodeFrame = function(name, payload) {
    return JSON.stringify([name, payload]);
  };

  Fb.decodeFrame = function(frameString) {
    var raw = JSON.parse(frameString)
    return {
      name: raw[0],
      message: raw[1]
    }
  };

  Fb.registerDevice = function(timeOut, meshUrl) {
    var meshUrl = meshUrl || '//meshblu.octoblu.com';
    var timeOut = timeOut || 3000;
    var request = new XMLHttpRequest();
    var promise = Fb.timerDefer(timeOut, "registering device");
    request.open('POST', meshUrl + '/devices?type=farmbotjs_client', true);

    request.onload = function() {
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

  Fb.extend = function(target, mixins) {
    mixins.forEach(function(mixin) {
      var iterate = function(prop) {
        target[prop] = mixin[prop];
      };
      Object.keys(mixin).forEach(iterate);
    });
    return target;
  };

  Fb.requireKeys = function(input, required) {
    required.forEach(function(prop) {
      if (!(input || {})[prop]) {
        throw (new Error("Expected input object to have `" + prop +
          "` property"));
      }
    });
  };

  Fb.uuid = function() {
    var template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    var replaceChar = function(c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    };
    return template.replace(/[xy]/g, replaceChar);
  };

  // This function isn't clever enough.
  Fb.token = function() {
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

  Fb.MeshErrorResponse = function(input) {
    return {
      error: {
        method: "error",
        error: input || "unspecified error"
      }
    }
  }

  function Fb(input) {
    if (!(this instanceof Fb)) {
      return new Fb(input);
    }
    this.options = {};
    Fb.extend(this.options, [Fb.config.defaultOptions, input]);
    Fb.requireKeys(this.options, Fb.config.requiredOptions);
  }

  global['Farmbot'] = Fb; // Simplifies my workflow when testing.

  return Fb
})(this);
