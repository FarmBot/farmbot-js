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
    FakeSioClient.start();
    bot
      .connect()
      .then(function(bot) {
        expect(bot).toEqual(bot);
        expect(bot.socket.connected).toBeTruthy();
        FakeSioClient.stop();
        done();
      })
      .catch(function(err) {
        FakeSioClient.stop();
        throw (new Error('Farmbot timed out. Can\'t connect to Mesh server.'));
      });
  });

  it('times out when connect()ing', function(done) {
    var oldEmit = FakeSioClient.prototype.emit // So we can set it back later.
    FakeSioClient.start();
    // By turning socket.emit() into a no op, we disable the clients ability to
    // subscribe to the bot. This will cause a timeout on connect.
    FakeSioClient.prototype.emit = function() { };
    bot
      .connect()
      .then(function(bot) {
        FakeSioClient.prototype.emit = oldEmit;
        FakeSioClient.stop();
        throw (new Error('Farmbot timeout is broke on connect().'));
      })
      .catch(function(err) {
        expect(err.message).toContain("timed out");
        FakeSioClient.prototype.emit = oldEmit;
        FakeSioClient.stop();
        done();
      });
  });


  it('connects to the server ...for real', function(done) {
    /* I use this test when I am debugging and need to be certain that connect()
    works with the current version of MeshBlu / Socket.io. Keep this test as
    pending() unless you want to make real network requests. */
    pending();
    bot
      .connect()
      .then(function(bot) {
        expect(bot).toEqual(bot);
        expect(bot.socket.connected).toBeTruthy();
        done();
      })
      .catch(function(err) {
        throw (new Error('Farmbot timed out. Can\'t connect to Mesh server.'));
      });
  });
});
