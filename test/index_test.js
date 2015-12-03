describe('FarmbotJS', function() {
  it('constructs a new farmbot object', function() {
    var bot = FarmbotJS({
      uuid: 'myUUID',
      token: 'myToken'
    });
    var options = bot.options;

    expect(options.uuid).toEqual('myUUID');
    expect(options.token).toEqual('myToken');
    expect(options.meshServer).toEqual(FarmbotJS.config.defaultOptions.meshServer);
    expect(options.timeout).toEqual(FarmbotJS.config.defaultOptions.timeout);
  });

  it('requires input', function() {
    var ouch = function() {
      FarmbotJS()
    };
    expect(ouch).toThrow();
  });

  describe("MeshErrorResponse", function() {
    it("sets defaults", function() {
      var mer = FarmbotJS.MeshErrorResponse();
      expect(mer.error).toBeDefined();
      expect(mer.error.method).toEqual("error");
      expect(mer.error.error).toContain("unspecified");
    });
  });
});
