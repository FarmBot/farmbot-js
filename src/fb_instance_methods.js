FarmbotJS.instanceMethods = {
  send: function(msg) {
    var msg = msg || {};
    var metaData = {
      devices: this.options.uuid,
      id: FarmbotJS.util.uuid()
    };
    FarmbotJS.util.extend(msg, [metaData]);
    FarmbotJS.util.requireKeys(msg, ["params", "method", "devices"]);
    return this.socket.emit("message", msg);
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

      that.socket = io.connect(FarmbotJS.config.defaultOptions.meshServer);
      that.socket.on('message', function(){
        var ok = JSON.stringify(arguments, null, 2);
        console.log("\n" + ok + "\n");
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
