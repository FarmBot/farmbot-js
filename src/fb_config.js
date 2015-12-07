FarmbotJS.config = {
  requiredOptions: ["uuid", "token", "meshServer", "timeout"],
  defaultOptions: {
    meshServer: 'meshblu.octoblu.com', // 'mesh.farmbot.io', 'wss://meshblu.octoblu.com/socket.io', //'ws://meshblu.octoblu.com/ws/v2',// 'ws://mesh.farmbot.io',
    timeout: 5000
  }
}
