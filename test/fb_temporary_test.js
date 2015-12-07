fdescribe("Raw websocket", function() {

  beforeAll(function(done) { done(); });

  it("connects to meshblu", function(done) {

    FarmbotJS
      .util
      .registerDevice("//mesh.farmbot.io")
      .then(function(crednetials) { return FarmbotJS(data).connect() })
      .then(function(data) { debugger; })
      .catch(function(data) { debugger; done(); })
  });
})
