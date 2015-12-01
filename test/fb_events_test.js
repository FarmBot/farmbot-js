describe('FarmbotJS.events', function() {
  it('attaches event listeners', function() {
    var bot1 = FarmbotJS({ uuid: '', token: '' });
    var bot2 = FarmbotJS({ uuid: '', token: '' });
    bot1.on("test", function(){});
    expect(bot1.event("test").length).toEqual(1);
    expect(bot2.event("test").length).toEqual(0);
  });

  it('fires event listeners', function() {
    var observation = {count: 0};
    var bot = FarmbotJS({ uuid: '', token: ''});
    expect(observation.count).toEqual(0);
    bot.on("test", function(count){ observation.count = count });
    bot.trigger("test", 3);
    expect(observation.count).toEqual(3);
  });
});
