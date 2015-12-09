// If you need to add utility methods for the test suite, put them here.
(function() {
  var enabled = Farmbot.registerDevice;
  var disabled = function() {
    return Promise.resolve({
      uuid: 'network-disabled',
      token: 'network-disabled'
    })
  }

  Farmbot.disableNetwork = function() {
    console.warn("Network connections to MeshBlu are disabled in test suite.")
    Farmbot.registerDevice = disabled
  };

  Farmbot.enableNetwork = function() {
    console.warn("Network connections to MeshBlu are enabled in test suite.")
    Farmbot.registerDevice = enabled
  };

  Farmbot.disableNetwork();
})()
