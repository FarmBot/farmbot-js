'use strict';

describe('Farmbot()', function() {
  it('constructs a new farmbot object', function() {
    var bot = Farmbot({
      uuid: 'myUUID',
      token: 'myToken'
    });
    var options = bot.options;

    expect(options.uuid).toEqual('myUUID');
    expect(options.token).toEqual('myToken');
    expect(options.meshServer).toEqual(Farmbot.config.defaultOptions.meshServer);
    expect(options.timeout).toEqual(Farmbot.config.defaultOptions.timeout);
  });
});
