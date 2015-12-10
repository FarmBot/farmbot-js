'use strict';

describe('Farmbot', function() {
  beforeEach(function(done) {
    done();
  });

  it("encodes websocket frames", function(done){
    expect(Farmbot.encodeFrame("message", {})).toEqual('["message",{}]');
    done();
  })

  it('constructs a new farmbot object', function() {
    var bot = Farmbot({
      uuid: 'myUUID',
      token: 'myToken'
    });

    expect(bot.getState("uuid")).toEqual('myUUID');
    expect(bot.getState("token")).toEqual('myToken');
    expect(bot.getState("meshServer")).toEqual(Farmbot.config.defaultOptions.meshServer);
    expect(bot.getState("timeout")).toEqual(Farmbot.config.defaultOptions.timeout);
  });

  it('handles MeshBlu AJAX server errors', function(done) {
    var stub = {
      status: 404,
      send: function() {}
    };
    spyOn(Farmbot, "__newXHR").and.returnValue(stub);
    Farmbot.enableNetwork();
    Farmbot
      .registerDevice()
      .catch(function(data) {
        expect(data).toEqual("it worked");
        done();
      });
    Farmbot.disableNetwork
    stub.onload("it worked");
  });

  it('handles MeshBlu AJAX network errors', function(done) {
    var stub = {
      status: 404,
      send: function() {}
    };
    spyOn(Farmbot, "__newXHR").and.returnValue(stub);
    Farmbot.enableNetwork();
    Farmbot
      .registerDevice()
      .catch(function(data) {
        expect(data).toEqual("it worked");
        done();
      });
    Farmbot.disableNetwork
    stub.onerror("it worked");
  });

  it('handles MeshBlu AJAX registration', function(done) {
    var stub = {
      status: 200,
      responseText: '{"uuid":"--","token":"-"}',
      send: function() {}
    };
    spyOn(Farmbot, "__newXHR").and.returnValue(stub);
    Farmbot.enableNetwork();
    Farmbot
      .registerDevice()
      .then(function(data) {
        expect(data.uuid).toEqual("--");
        expect(data.token).toEqual("-");
        done();
      })
    stub.onload();
    Farmbot.disableNetwork
  });


});
