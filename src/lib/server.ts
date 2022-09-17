// server 启动本地预览服务

import http from 'http'
import logger from '../utils/logger'
import { GetConfig } from '../utils'
import tryConnetcUsablePort from '../utils/autoPort'
import { main, watchServer } from '../utils/serverUtils'

export default async function (port: number) {
  const config = GetConfig()

  if (!port) port = config.port || 7890

  // 连接可用端口
  tryConnetcUsablePort(port, (UsablePort: number) => {
    const server = http.createServer(main)

    server.on('listening', () => logger.info('Start the local preview service ...'))

    server.listen(UsablePort, '127.0.0.1', () =>
      logger.info('Service started, please visit: http://127.0.0.1:' + UsablePort)
    )
  })
  watchServer()
}
