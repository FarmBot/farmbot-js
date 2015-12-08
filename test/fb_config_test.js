describe('FarmbotJS.config', function() {
  it('explicitly states required config options', function() {
    ['uuid', 'token', 'meshServer', 'timeout'].forEach(function(option) {
      expect(FarmbotJS.config.requiredOptions).toContain(option);
    });
  });
});
