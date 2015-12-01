describe('an instance of FarmbotJS ', function() {
  var bot;

  beforeEach(function(done) {
    bot = FarmbotJS({
      uuid: "73425170-2660-49de-acd9-6fad4989aff6",
      token: 'bcbd352aaeb9b7f18214a63cb4f3b16b89d8fd24'
    });
    done();
  })

  it('connects to the server', function(done) {
    bot
      .connect()
      .then(function(data) {
        done();
        pending();
      })
      .catch(function(err) {
        throw (new Error('Attempted to connect to Farmbot, but it timed out.'));
      });
  });
});
