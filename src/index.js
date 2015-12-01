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
      meshServer: 'ws://mesh.farmbot.io',
      timeout: 1000
    }
  }

  FarmbotJS._instanceMethods = {
    rawSend: function(msg) { this.socket.send(JSON.stringify(msg)); },
    connect: function(){
      var executor = function(resolve, reject) {
        this.socket = new WebSocket("wss://meshblu.octoblu.com/ws/v2");

        // Case 1: OK
        // Case 2: Error
        // Case 3: Timeout
        // reject("No!");
        resolve("Yes!");
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
