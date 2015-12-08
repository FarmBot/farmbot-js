describe('Farmbot', function() {
  it('constructs a new farmbot object', function() {
    var bot = Farmbot({
      uuid: 'myUUID',
      token: 'myToken'
    });
    var options = bot.options;

    expect(options.uuid).toEqual('myUUID');
    expect(options.token).toEqual('myToken');
    expect(options.meshServer).toEqual(Farmbot.config.defaultOptions.meshServer);
    expect(options.timeout).toEqual(Farmbot.config.defaultOptions.timeout);
  });

  it('requires input', function() {
    var ouch = function() {
      Farmbot()
    };
    expect(ouch).toThrow();
  });

  describe("MeshErrorResponse", function() {
    it("sets defaults", function() {
      var mer = Farmbot.MeshErrorResponse();
      expect(mer.error).toBeDefined();
      expect(mer.error.method).toEqual("error");
      expect(mer.error.error).toContain("unspecified");
    });
  });
});
