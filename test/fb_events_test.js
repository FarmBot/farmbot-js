describe('Farmbot.events', function() {
  var bot;
  var observation;

  function capture(data) {
    observation.count++;
    observation.captured.push(data);
  }

  beforeEach(function() {
    observation = {
      count: 0,
      captured: []
    };
    bot = Farmbot({
      uuid: '---',
      token: '---'
    });
  });

  it('attaches event listeners', function() {
    var bot1 = Farmbot({
      uuid: '---',
      token: '---'
    });
    var bot2 = Farmbot({
      uuid: '---',
      token: '---'
    });
    bot1.on('test', function() {});
    expect(bot1.event('test').length).toEqual(1);
    expect(bot2.event('test').length).toEqual(0);
  });

  it('fires event listeners', function() {
    expect(observation.count).toEqual(0);
    bot.on('test', capture);
    bot.emit('test', 3);
    expect(observation.count).toEqual(1);
    expect(observation.captured[0]).toEqual(3);
  });

  it('has a catch-all event named `*`', function() {
    bot.on('*', capture);
    bot.emit('anything', 'at all');
    expect(observation.count).toEqual(1);
    expect(observation.captured[0]).toEqual('at all');
  });
});
