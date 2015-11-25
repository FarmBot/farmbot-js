var FarmbotJS = FarmbotJS || {};

(function(F, window){
  "use strict";

  function extend(target, mixins) {
    mixins.forEach(function(mixin){
      for (var prop in mixin) { target[prop] = mixin[prop]; }
    });
    return target;
  };

  function validateOptions(input, required) {
    required.forEach(function(prop, inx, parent){
      if (!parent.hasOwnProperty(prop)) {
        throw(new Error("FarmbotJS options require a " + prop + " property"));
      }
    });
  }

  var requiredOptions = ["uuid", "token", "meshServer", "timeout"];

  var defaultOptions = {
    meshServer: 'ws://mesh.farmbot.io',
    timeout: 1000
  };

  F.create = function(input) {
    var bot = {};
    bot.options = extend({}, [defaultOptions, (input || {})]);
    validateOptions(bot.options, requiredOptions);
    return bot;
  };

})(FarmbotJS, window);
