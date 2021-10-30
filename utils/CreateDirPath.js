const { parse } = require('path')
const { existsSync, mkdirSync } = require('fs')

/**
 * 根据一个路径创建目录
 * @param {String} path 路径
 * @param {Boolean} isFile 是否是文件路径 default: false
 */
function CreateDirPath(path, isFile = false) {
  let result

  // 获取上级目录
  if (isFile) path = parse(path).dir

  // 路径是否存在
  const isExists = existsSync(path)
  if (isExists) return true
  else result = CreateDirPath(parse(path).dir)
  if (result) mkdirSync(path)
}

module.exports = CreateDirPath
