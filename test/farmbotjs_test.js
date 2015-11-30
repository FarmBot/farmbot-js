describe("FarmbotJS", function(){
  "use strict";
  it('extends objects using .extend(obj, [mixins...])', function(){
    var extended = {};
    var mixin1 = {mixin1: 123};
    var mixin2 = {mixin2: 456};
    FarmbotJS.extend(extended, [mixin1, mixin2]);

    expect(extended.mixin1).toEqual(123);
    expect(extended.mixin2).toEqual(456);
  });

  it('explicitly states required config options', function(){
    ["uuid", "token", "meshServer", "timeout"].forEach(function(option){
      expect(FarmbotJS.requiredOptions).toContain(option);
    });
  });

  it('validates input options against required fields', function(){
    var requiredFields = ["important"];
    var expectedError = new Error(
      "Expected input object to have `important` property");
    var badAttempt = function() { FarmbotJS.requireKeys({}, requiredFields) };
    var goodAttempt = function() {
      FarmbotJS.requireKeys({important: "yes"}, requiredFields)
    };

    expect(FarmbotJS.requireKeys).toBeDefined();
    expect(badAttempt).toThrow(expectedError);
    expect(goodAttempt).not.toThrow(expectedError);
  });

  it('provides default options', function(){
    var defaultOptions = {
      meshServer: 'ws://mesh.farmbot.io',
      timeout: 1000
    };

    expect(FarmbotJS.defaultOptions).toBeDefined();
    for (var option in defaultOptions) {
      var expectation = defaultOptions[option];
      var reality = FarmbotJS.defaultOptions[option];
      expect(expectation).toEqual(reality);
    };
  });

  it('constructs a new farmbot object', function(){
    var bot = FarmbotJS({uuid: "myUUID", token: "myToken"});
    var options = bot.options;

    expect(options.uuid).toEqual("myUUID");
    expect(options.token).toEqual("myToken");
    expect(options.meshServer).toEqual(FarmbotJS.defaultOptions.meshServer);
    expect(options.timeout).toEqual(FarmbotJS.defaultOptions.timeout);
  });
});
