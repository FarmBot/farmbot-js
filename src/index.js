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
    connect: function(){
      var executor = function(resolve, reject) {
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
