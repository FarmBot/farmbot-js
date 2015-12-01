FarmbotJS._instanceMethods = {
  rawGet: function (msg) {
    var message = JSON.parse(msg.data);
    console.log(message);
  },
  rawSend: function(msg) { this.socket.send(JSON.stringify(msg)); },
  connect: function(){
    var executor = function(resolve, reject) {
      this.socket = new WebSocket(FarmbotJS.config.defaultOptions.meshServer);
      this.socket.onopen = function() {
        console.log("WIP: Socket open")
      }.bind(this)
      this.socket.onmessage = function(e) {
        console.log("WIP: Socket message:")
        console.log(e.data);
        this.rawGet(e);
      }.bind(this)
      setTimeout(function(){ resolve("OK") }, 4000);
    };
    return new window.Promise(executor.bind(this));
  }
}
