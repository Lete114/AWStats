// server 启动本地预览服务

const http = require('http')
const logger = require('../utils/logger')
const { GetConfig } = require('../utils')
const tryConnetcUsablePort = require('../utils/AutoPort')

const { Main, WatchServer } = require('../utils/serverUtils')

module.exports = async function (port) {
  const config = GetConfig()

  if (!port) port = config.port || 114

  // 连接可用端口
  tryConnetcUsablePort(port, (UsablePort) => {
    port = UsablePort

    const server = http.createServer(Main)

    server.on('listening', () => logger.info('Start the local preview service ...'))

    server.listen(port, '127.0.0.1', () => logger.info('Service started, please visit: http://127.0.0.1:' + port))
  })
  WatchServer()
}
