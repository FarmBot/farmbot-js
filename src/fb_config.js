FarmbotJS.config = {
  requiredOptions: ["uuid", "token", "meshServer", "timeout"],
  defaultOptions: {
    meshServer: 'ws://mesh.farmbot.io',//'wss://meshblu.octoblu.com/socket.io', // 'ws://mesh.farmbot.io/ws/v2',
    timeout: 1000
  }
}
