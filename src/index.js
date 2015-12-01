(function(window) {
  "use strict";

  // TODO: Add a FarmbotJS.util namespace?
  FarmbotJS.extend = function(target, mixins) {
    mixins.forEach(function(mixin) {
      var iterate = function(prop) {
        target[prop] = mixin[prop];
      };
      Object.keys(mixin).forEach(iterate);
    });
    return target;
  };

  FarmbotJS.requiredOptions = ["uuid", "token", "meshServer", "timeout"];

  FarmbotJS.requireKeys = function(input, required) {
    required.forEach(function(prop) {
      if (!input.hasOwnProperty(prop)) {
        throw (new Error("Expected input object to have `" + prop +
          "` property"));
      }
    });
  };

  FarmbotJS.defaultOptions = {
    meshServer: 'ws://mesh.farmbot.io',
    timeout: 1000
  };

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
    bot.options = FarmbotJS.extend({}, [FarmbotJS.defaultOptions, input || {}]);
    FarmbotJS.requireKeys(bot.options, FarmbotJS.requiredOptions);

    // Add instance methds via composition.
    FarmbotJS.extend(bot, [FarmbotJS._instanceMethods]);

    return bot;
  }

  window.FarmbotJS = FarmbotJS; // TODO: Modules (UMD?);
}(window));
