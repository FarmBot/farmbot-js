(function() {

  FarmbotJS.instanceMethods = {
    buildMessage: function(input) {
      var msg = input || {};
      var metaData = {
        devices: (msg.devices || this.options.uuid),
        id: (msg.id || FarmbotJS.util.uuid())
      };
      FarmbotJS.util.extend(msg, [metaData]);
      FarmbotJS.util.requireKeys(msg, ["params", "method", "devices", "id"]);
      return msg;
    },
    sendRaw: function(input, zzz) {
      if (this.socket) {
        var msg = this.buildMessage(input);
        this.socket.send(JSON.stringify(["message", msg]));
        return msg;
      } else {
        throw new Error("You must connect() before sending data");
      };
    },
    send: function(input) {
      var that = this;
      var msg = that.sendRaw(input);
      var promise = FarmbotJS.util.timerDefer(that.options.timeout,
        msg.method + " " + msg.params);
      that.on(msg.id, function(response) {
        var respond = (response && response.result) ? promise.resolve : promise.reject;
        respond(response);
      })
      return promise
    },
    __newSocket: function() { // for easier testing.
      return new WebSocket("ws://" + this.options.meshServer + "/ws/v2");
    },
    __newConnection: function(credentials) {
      var that = this;
      var promise = FarmbotJS.util.timerDefer(that.options.timeout,
        "__newConnection");
      that.socket = that.__newSocket();
      that.socket.onopen = function() {
        that.socket.send(FarmbotJS.util.encodeFrame("identity", credentials));
      };

      that.socket.onmessage = function(e) {
        var msg = FarmbotJS.util.decodeFrame(e.data);
        var id = msg.message.id;

        if (id) {
          that.emit(id, msg.message);
        } else {
          that.emit(msg.name, msg.message);
        };
      };

      that.on("ready", function() { promise.resolve(that) });

      return promise;
    },
    connect: function() {
      var that = this;
      return new window.Promise(function(resolve, reject) {

        function subscribe() {
          that.socket.send(FarmbotJS.util.encodeFrame("subscribe", that));
          resolve(that);
        }

        FarmbotJS.util.registerDevice()
          .then(that.__newConnection.bind(that))
          .then(subscribe)
      });
    }
  }

})()
