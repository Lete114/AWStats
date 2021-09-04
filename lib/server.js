// server 启动本地预览服务

const fs = require('fs')
const path = require('path')
const http = require('http')
const logger = require('./logger')
const { parseConfigFile, resolvePath } = require('../utils')
const tryConnetcUsablePort = require('../utils/autoPort')

module.exports = function () {
  const root_config = parseConfigFile('/config.yml')
  const public = resolvePath('/' + root_config.public)
  let port = root_config.port || 114

  // 连接可用端口
  tryConnetcUsablePort(port, (UsablePort) => {
    port = UsablePort
    // 获取请求资源类型
    function getMime(extname, callback) {
      const mime = path.resolve(__dirname + '/../source/mime.json')
      fs.readFile(mime, (err, data) => {
        if (err) throw Error('Not Found mime.json File！')
        //转成JSON
        var mimeJSON = JSON.parse(data)
        var mime = mimeJSON[extname] || 'text/plain'
        //读完执行回调函数，mime类型字符串，就是它的参数
        callback(mime)
      })
    }

    const server = http.createServer((req, res) => {
      // 将请求转换为url对象
      var url = new URL(`http://127.0.0.1:${port}${req.url}`)
      let pathname = url.pathname

      //判断此时用户输入的地址是文件夹地址还是文件地址
      //如果是文件夹地址，那么自动请求这个文件夹中的index.html
      if (pathname.indexOf('.') == -1) {
        pathname += 'index.html'
      }
      //输入的网址是127.0.0.1/index.html
      //实际请求的是./public/index.html
      var file_path = path.normalize(`${public}/${pathname}`)
      //得到拓展名
      var extname = path.extname(pathname)
      //把文件读出来
      fs.readFile(file_path, (err, data) => {
        if (err) {
          fs.readFile(`${public}/404.html`, (err, data) => {
            res.writeHead(404, { 'Content-Type': 'text/html;charset=utf8' })
            if (err) res.end('Not Find 404')
            res.end(data)
          })
        }

        getMime(extname, (mime) => {
          res.writeHead(200, { 'Content-Type': mime })
          res.end(data)
        })
      })
    })

    server.on('listening', () => logger.info('Start the local preview service ...'))

    server.listen(port, '127.0.0.1', () => logger.info('Service started, please visit: http://127.0.0.1:' + port))
  })
}
