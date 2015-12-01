(function(window) {
  "use strict";

  FarmbotJS.util = {
    extend: function(target, mixins) {
      mixins.forEach(function(mixin) {
        var iterate = function(prop) {
          target[prop] = mixin[prop];
        };
        Object.keys(mixin).forEach(iterate);
      });
      return target;
    },

    requireKeys: function(input, required) {
      required.forEach(function(prop) {
        if (!input.hasOwnProperty(prop)) {
          throw (new Error("Expected input object to have `" + prop +
            "` property"));
        }
      });
    },

    uuid: function() {
      var template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
      var replaceChar = function(c) {
        var r = Math.random() * 16 | 0;
        var v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
      };
      return template.replace(/[xy]/g, replaceChar);
    },
    // This function isn't clever enough.
    token: function() {
      var randomHex = function(){
        return Math.
          floor((1 + Math.random()) * 0x10000).
          toString(16).
          substring(1);
      }
      var i = 10;
      var results = [];
      while(i--) {
        results.push(randomHex());
      }
      return results.join('');
    }
  }

  FarmbotJS.config = {
    requiredOptions: ["uuid", "token", "meshServer", "timeout"],
    defaultOptions: {
      meshServer: 'ws://mesh.farmbot.io/ws/v2',
      timeout: 1000
    }
  }

  FarmbotJS._instanceMethods = {
    rawGet: function (msg) {
      var message = JSON.parse(msg.data);
      console.log(message);
    },
    rawSend: function(msg) { this.socket.send(JSON.stringify(msg)); },
    connect: function(){
      var executor = function(resolve, reject) {
        this.socket = new WebSocket(FarmbotJS.config.defaultOptions.meshServer);
        this.socket.onopen = function() {
          console.log("WIP: Socket open")
        }.bind(this)
        this.socket.onmessage = function(e) {
          console.log("WIP: Socket message:")
          console.log(e.data);
          this.rawGet(e);
        }.bind(this)
        setTimeout(function(){ resolve("OK") }, 4000);
      };
      return new window.Promise(executor.bind(this));
    }
  }

  function FarmbotJS(input) {
    var bot = {};
    // Validate / Set config options.
    bot.options = FarmbotJS
      .util
      .extend({}, [FarmbotJS.config.defaultOptions, input || {}]);
    FarmbotJS.util.requireKeys(bot.options, FarmbotJS.config.requiredOptions);

    // Add instance methds via composition.
    FarmbotJS.util.extend(bot, [FarmbotJS._instanceMethods]);

    return bot;
  }

  window.FarmbotJS = FarmbotJS; // TODO: Modules (UMD?);
}(window));
