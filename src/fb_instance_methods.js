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
      var msg = this.buildMessage(input);
      this.socket.emit("message", msg);
      return msg;
    },
    send: function(input) {
      var that = this;
      var msg = this.sendRaw(input)
      return new Promise(function(resolve, reject) {
        var finished = false;
        var timeout = function() {
          if (finished) {
            return; // Request didnt time out.
          } else {
            var wut = FarmbotJS.MeshErrorResponse("Timed out");
            reject(wut);
          };
        };
        setTimeout(timeout, that.options.timeout)
        that.on(msg.id, function(response) {
          if (response && response.result) {
            resolve(response);
          } else {
            reject(response);
          }
        })
      });
    },
    // TODO: SEE THESE NOTES:
    //   This code has 2 areas of technical debt:
    // 1. MeshBlu credentials are hardcoded when we really need to be making
    //  'guest' accounts
    // 2. connect() has high complexity. Hopefully I can refactor this into
    //  something like this:
    // wow
    //   .getCredentials() // Create MeshBlu creds.
    //   .then(function() { wow.connect() }) // Connect to meshblu
    //   .then(function() { wow.identify() }) // React to 'identify' from server
    //   .then(function() { wow.emitIdentity() }) // emit credentials
    //   .then(function() { wow.emitSubscribe() }) // Subscribe to bot.
    //   .then(function() { wow.finalize() }) // Resolve or reject connect() here.
    connect: function() {
      return new window.Promise(function(resolve, reject) {
        var that = this;
        var completed = false;

        var me = { // This is bad and must be fixed.
          uuid: "73425170-2660-49de-acd9-6fad4989aff6",
          token: "bcbd352aaeb9b7f18214a63cb4f3b16b89d8fd24"
        };

        var you = {
          uuid: that.options.uuid,
          token: that.options.token
        };

        that.socket = io.connect(that.options.meshServer);
        that.socket.on('message', function(msg) {

          // Message is echo or empty
          if (!msg || msg.fromUuid === me.uuid) {
            return
          }

          // Message is response.
          if (msg && Object.keys(msg).length > 0  && msg.id) {
            that.emit(msg.id, msg);
            delete that.events[msg.id];
          }

          console.log("\n" + JSON.stringify(msg, null, 2) + "\n");
        });

        var identified = function() {
          that.socket.emit('identity', me);
          that.socket.emit('subscribe', you, subscribed);

        };

        var connected = function() {
          that.socket.on('identify', identified);
        };

        var timedOut = function() {
          if (!completed) {
            reject(new Error("Connection timed out"))
          };
        };

        var subscribed = function(data) {
          var completed = true; // Stop the timeout from happening.
          if (data.error) {
            that.socket.disconnect();
            reject(data.error);
          } else {
            resolve(that);
          };
        };

        that.socket.on('connect', connected);
        setTimeout(timedOut, that.options.timeout)
      }.bind(this));
    }
  }

})()
