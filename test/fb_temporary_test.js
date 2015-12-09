describe("Raw websocket", function() {
  var goodCreds = {
    uuid: "f301844b-ec12-4200-b67e-76464f9ce657",
    token: "32bf30df92a24c9ac755aeed96eb4182f74dc512"
  };

  beforeAll(function(done) { done(); });

  it("connects to meshblu", function(done) {
      var bot = Farmbot(goodCreds);
      bot
        .connect()
        .then(function(bot) {
          expect(bot).toEqual(bot);
          done();
        })
        .catch(done)
      done();
  });
})
