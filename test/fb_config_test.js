describe('Farmbot.config', function() {
  it('explicitly states required config options', function() {
    ['uuid', 'token', 'meshServer', 'timeout'].forEach(function(option) {
      expect(Farmbot.config.requiredOptions).toContain(option);
    });
  });
});
