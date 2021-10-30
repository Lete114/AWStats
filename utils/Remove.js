const { join } = require('path')
const {existsSync,readdirSync,statSync,rmdirSync,unlinkSync}= require('fs')

/**
 * 删除目录下的所有文件及目录，包括当前目录
 * @param path 需要删除的路径文件夹
 */
function Clear(path) {
  if (!existsSync(path)) return
  const files = readdirSync(path)
  for (let item of files) {
    const filepath = join(path,item)
    const stats = statSync(filepath)
    if (stats.isDirectory()) Clear(filepath)
    else unlinkSync(filepath) //删除文件
  }
  rmdirSync(path) // 删除文件夹
}

module.exports = Clear
