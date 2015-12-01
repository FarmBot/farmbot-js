'use strict';

describe('FarmbotJS.util', function() {
  it('extends objects using .extend(obj, [mixins...])', function() {
    var extended = {};
    var mixin1 = {
      mixin1: 123
    };
    var mixin2 = {
      mixin2: 456
    };
    FarmbotJS.util.extend(extended, [mixin1, mixin2]);

    expect(extended.mixin1).toEqual(123);
    expect(extended.mixin2).toEqual(456);
  });

  it('validates input options against required fields', function() {
    expect(FarmbotJS.util.requireKeys).toBeDefined();

    var requiredFields = ['important'];
    var expectedError = new Error(
      'Expected input object to have `important` property');
    var badAttempt = function() {
      FarmbotJS.util.requireKeys({}, requiredFields)
    };
    var goodAttempt = function() {
      FarmbotJS.util.requireKeys({
        important: 'yes'
      }, requiredFields);
    };

    expect(badAttempt).toThrow(expectedError);
    expect(goodAttempt).not.toThrow(expectedError);
  });

  it('generates UUIDs', function(){
    expect(FarmbotJS.util.uuid).toBeDefined;
    var uuid = FarmbotJS.util.uuid();
    var segments = uuid.split("-");

    expect(uuid.length).toEqual(36);
    expect(uuid[14]).toEqual('4');
    expect(segments.length).toEqual(5);
    expect(segments.pop().length).toEqual(12);
    expect(segments.pop().length).toEqual(4);
    expect(segments.pop().length).toEqual(4);
    expect(segments.pop().length).toEqual(4);
    expect(segments.pop().length).toEqual(8);
  });

  it('generates tokens', function(){
    expect(FarmbotJS.util.token).toBeDefined;
    var token = FarmbotJS.util.token();
    expect(token.length).toEqual(40);
    expect(token).toMatch(/[0-9a-f]{40}/);
  });

});

describe('FarmbotJS.config', function() {
  it('provides default options', function() {
    var defaultOptions = {
      meshServer: 'ws://mesh.farmbot.io/ws/v2',
      timeout: 1000
    };

    expect(FarmbotJS.config.defaultOptions).toBeDefined();
    for (var option in defaultOptions) {
      var expectation = defaultOptions[option];
      var reality = FarmbotJS.config.defaultOptions[option];
      expect(expectation).toEqual(reality);
    };
  });

  it('explicitly states required config options', function() {
    ['uuid', 'token', 'meshServer', 'timeout'].forEach(function(option) {
      expect(FarmbotJS.config.requiredOptions).toContain(option);
    });
  });
});



describe('an instance of FarmbotJS ', function() {
  var bot;

  beforeEach(function(done) {
    bot = FarmbotJS({
      uuid: 'myUUID',
      token: 'myToken'
    });
    done();
  })

  it('connects to the server', function(done) {
    bot
      .connect()
      .then(function() { done(); })
      .catch(function() { done(); });
    console.log('FIXME');
  });
});

describe('FarmbotJS()', function() {
  it('constructs a new farmbot object', function() {
    var bot = FarmbotJS({
      uuid: 'myUUID',
      token: 'myToken'
    });
    var options = bot.options;

    expect(options.uuid).toEqual('myUUID');
    expect(options.token).toEqual('myToken');
    expect(options.meshServer).toEqual(FarmbotJS.config.defaultOptions.meshServer);
    expect(options.timeout).toEqual(FarmbotJS.config.defaultOptions.timeout);
  });
});
