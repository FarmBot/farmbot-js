(function(window){
  "use strict";

  FarmbotJS.extend = function(target, mixins) {
    mixins.forEach(function(mixin){
      for (var prop in mixin) { target[prop] = mixin[prop]; }
    });
    return target;
  };

  FarmbotJS.requiredOptions = ["uuid", "token", "meshServer", "timeout"];

  FarmbotJS.requireKeys = function(input, required) {
    required.forEach(function(prop, inx, parent){
      if (!input.hasOwnProperty(prop)) {
        throw(new Error("Expected input object to have `" + prop + "` property"));
      }
    });
  }

  FarmbotJS.defaultOptions = {
    meshServer: 'ws://mesh.farmbot.io',
    timeout: 1000
  };

  function FarmbotJS(input){
    var bot = {};
    bot.options = FarmbotJS.extend({}, [FarmbotJS.defaultOptions, (input || {})]);
    FarmbotJS.requireKeys(bot.options, FarmbotJS.requiredOptions);
    return bot;
  };

  window.FarmbotJS = FarmbotJS; // TODO: Modules (UMD?);
})(window);
