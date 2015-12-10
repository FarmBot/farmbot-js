describe('State management', function() {
  var bot;
  beforeEach(function(){
    bot = Farmbot({uuid: '-', token: '-'});
  })

  it('lists all state object entries via this.listState()', function() {
    var result = bot.listState();
    expect(result.length).toBeGreaterThan(0);
    expect(result).toContain('uuid');
    expect(result).toContain('token');
  });

  it('reads a state entry via this.getState(entry)', function() {
    var result = bot.getState('uuid');
    expect(result).toEqual('-');
  });

  it('sets a state entry via this.setState(entry)', function() {
    var result;
    bot.on("change", function(outcome) { result = outcome; });
    bot.setState('uuid', '~');
    expect(result.oldValue).toEqual('-');
    expect(result.value).toEqual('~');
    expect(result.name).toEqual('uuid');
  });

  it('only emits a `change` event if data actually changed', function() {
    var result;
    bot.on("change", function(outcome) { result = outcome; });
    bot.setState('uuid', '-');
    expect(result).toBeFalsy();
  });
});
