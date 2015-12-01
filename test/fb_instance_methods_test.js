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
    pending();
    bot
      .connect()
      .then(function() { done(); })
      .catch(function() { done(); });
  });
});
