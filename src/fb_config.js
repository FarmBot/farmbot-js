FarmbotJS.config = {
  requiredOptions: ["uuid", "token", "meshServer", "timeout"],
  defaultOptions: {
    meshServer: 'ws://mesh.farmbot.io',//"//meshblu.octoblu.com", //'wss://meshblu.octoblu.com/socket.io', //'ws://meshblu.octoblu.com/ws/v2',// 'ws://mesh.farmbot.io',
    timeout: 5000
  }
}
