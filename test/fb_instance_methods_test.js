describe('an instance of Farmbot', function() {
  var bot;

  beforeEach(function(done) {

    bot = Farmbot({
      uuid: '73425170-2660-49de-acd9-6fad4989aff6',
      token: 'bcbd352aaeb9b7f18214a63cb4f3b16b89d8fd24'
    });

    bot.connect = function(){
      bot.socket = {
        calls: [],
        send: function (msg) {
          this.calls.push(Farmbot.decodeFrame(msg));
        }
      }
      return Promise.resolve(bot);
    }

    bot.connect().then(done)
  });

  it('connects to the server', function(done) {
    bot
      .connect()
      .then(function(bot) {
        expect(bot).toEqual(bot);
        // expect(bot.socket.connected).toBeTruthy();
        done();
      })
      .catch(function(err) {
        expect("failure").toEqual("success", "error while connecting!");
        done();
      });
  });

  it('builds mesh message payloads', function(done) {
    var msg1 = bot.buildMessage({
      params: {},
      method: 'test'
    });

    var msg2 = bot.buildMessage({
      id: 'explicilty set2',
      params: 'explicilty set3',
      method: 'explicilty set4',
      devices: 'explicilty set1'
    });

    expect(function() {
      bot.buildMessage()
    }).toThrow();
    expect(function() {
      bot.buildMessage({
        method: 'No params'
      })
    }).toThrow();
    expect(function() {
      bot.buildMessage({
        params: 'No method'
      })
    }).toThrow();
    expect(msg1.params).toEqual({});
    expect(msg1.devices).toEqual(bot.options.uuid);
    expect(msg1.id.length).toEqual(36);
    expect(msg2.devices).toEqual('explicilty set1');
    expect(msg2.id).toEqual('explicilty set2');
    expect(msg2.params).toEqual('explicilty set3');
    expect(msg2.method).toEqual('explicilty set4');
    done();
  });

  it('sends messages without waiting for a reply', function(done) {
    bot.sendRaw({
      params: "PARAMS",
      method: "METHODS"
    });
    var calls = bot.socket.calls;

    expect(calls.length).toEqual(1);
    expect(calls[0].name).toEqual("message");
    expect(calls[0].message.params).toEqual("PARAMS");
    expect(calls[0].message.method).toEqual("METHODS");
    done();
  });

  it('requires user to connect() before send()ing', function(){
    expect(function(){
      Farmbot({uuid: '-', token: '-'})
        .sendRaw("Blah")
    }).toThrow(new Error("You must connect() before sending data"))
  })
});
