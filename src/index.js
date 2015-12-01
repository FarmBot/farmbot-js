(function(window) {
  "use strict";

  function FarmbotJS(input) {
    var bot = {};
    bot.options = FarmbotJS.extend({}, [FarmbotJS.defaultOptions, (input || {})]);
    FarmbotJS.requireKeys(bot.options, FarmbotJS.requiredOptions);
    return bot;
  }

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

  window.FarmbotJS = FarmbotJS; // TODO: Modules (UMD?);
}(window));
