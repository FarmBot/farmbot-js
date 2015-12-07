describe('FarmbotJS.config', function() {
  xit('provides default options', function() {
    var defaultOptions = {
      meshServer: 'ws://mesh.farmbot.io',
      timeout: 5000
    };

    expect(FarmbotJS.config.defaultOptions).toBeDefined();
    for (var option in defaultOptions) {
      var expectation = defaultOptions[option];
      var reality = FarmbotJS.config.defaultOptions[option];
      expect(expectation).toEqual(reality);
    };
  });

  it('explicitly states required config options', function() {
    ['uuid', 'token', 'meshServer', 'timeout'].forEach(function(option) {
      expect(FarmbotJS.config.requiredOptions).toContain(option);
    });
  });
});
