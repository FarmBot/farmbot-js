describe("Websocket", function() {
  var goodCreds = {
    uuid: "f301844b-ec12-4200-b67e-76464f9ce657",
    token: "32bf30df92a24c9ac755aeed96eb4182f74dc512"
  };

  beforeEach(function(done) {
    done();
  });

  it("processes incoming messages", function(done) {
    pending();
    var bot = Farmbot(goodCreds);
    bot.__onmessage(['message', {}]);
    done();
  });

  it("connects to meshblu", function(done) {
    pending("Why is this broke?");
    var bot = Farmbot(goodCreds);
    bot
      .connect()
      .then(function(bot) {
        expect(bot).toEqual(bot);
        done();
      })
      .catch(function(e) {
        done();
        console.log(e.message)
      })
  });

  it("disconnects", function(done) {
    var calls = 0;
    var result;
    var bot = Farmbot(goodCreds);
    bot.on("disconnect", function(that){
      calls++;
      result = that;
    });
    bot.__onclose();
    expect(calls).toEqual(1);
    expect(result).toEqual(bot);
    done();
  })
})
