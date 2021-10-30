// server 启动本地预览服务

const { readFile } = require('fs')
const { join, extname } = require('path')
const http = require('http')
const logger = require('../utils/logger')
const { parseConfigFile, resolvePath, GetMime, Handler404 } = require('../utils')
const tryConnetcUsablePort = require('../utils/AutoPort')

module.exports = function (port) {
  const root_config = parseConfigFile('/config.yml')
  const public = resolvePath(root_config.public)
  if (!port) port = root_config.port || 114

  // 连接可用端口
  tryConnetcUsablePort(port, (UsablePort) => {
    port = UsablePort

    const server = http.createServer((req, res) => {
      // 将请求转换为url对象
      const url = new URL(`http://127.0.0.1:${port}${req.url}`)
      let pathname = url.pathname

      // 自动匹配/index.html
      if (pathname.indexOf('.') == -1) pathname += 'index.html'

      // 读取文件
      const filePath = join(public, pathname)
      readFile(filePath, async (err, data) => {
        if (err) return Handler404(res, public)
        const mime = await GetMime(extname(pathname))
        res.writeHead(200, { 'Content-Type': mime })
        res.end(data)
      })
    })

    server.on('listening', () => logger.info('Start the local preview service ...'))

    server.listen(port, '127.0.0.1', () => logger.info('Service started, please visit: http://127.0.0.1:' + port))
  })
}
