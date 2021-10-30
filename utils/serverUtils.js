const { readFile } = require('fs')
const { join } = require('path')

/**
 * 获取Mime类型
 * @param {*} extname
 * @param {*} callback
 */
function GetMime(extname) {
  const mimePath = join(__dirname, '../source/mime.json')
  return new Promise((resolve, reject) => {
    const mime = require(mimePath)
    resolve(mime[extname] || 'text/plain')
  })
}

/**
 * 处理404
 * @param {*} res
 * @param {*} public
 */
function Handler404(res, public) {
  const error404 = join(public, '404.html')
  readFile(error404, (err, data) => {
    res.writeHead(404, { 'Content-Type': 'text/html;charset=utf8' })
    if (err) res.end('Not Find 404')
    res.end(data)
  })
}

module.exports = { GetMime, Handler404 }
