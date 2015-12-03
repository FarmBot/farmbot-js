function FarmbotJS(input) {
  var bot = {};
  // Validate / Set config options.
  bot.options = FarmbotJS
    .util
    .extend({}, [FarmbotJS.config.defaultOptions, input]);
  FarmbotJS.util.requireKeys(bot.options, FarmbotJS.config.requiredOptions);

  // Add instance methds via composition.
  FarmbotJS.util.extend(bot, [
    FarmbotJS.instanceMethods,
    FarmbotJS.events,
    FarmbotJS.commands
  ]);
  return bot;
}


FarmbotJS.MeshErrorResponse = function(input) {
  return {
    error: {
      method: "error",
      error: input || "unspecified error"
    }
  }
}
