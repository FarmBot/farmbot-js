describe('Farmbot.events', function() {
  it('attaches event listeners', function() {
    var bot1 = Farmbot({ uuid: '---', token: '---' });
    var bot2 = Farmbot({ uuid: '---', token: '---' });
    bot1.on('test', function(){});
    expect(bot1.event('test').length).toEqual(1);
    expect(bot2.event('test').length).toEqual(0);
  });

  it('fires event listeners', function() {
    var observation = {count: 0};
    var bot = Farmbot({ uuid: '---', token: '---'});
    expect(observation.count).toEqual(0);
    bot.on('test', function(count){ observation.count = count });
    bot.emit('test', 3);
    expect(observation.count).toEqual(3);
  });
});
