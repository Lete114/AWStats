const { join, extname } = require('path')
const { statSync, readdirSync, existsSync } = require('fs')

/**
 * 读取一个目录下的所有文件
 * @param {String} dirPath 目标目录
 * @param {Object} options 选项:
 * @returns {Array}
 */
function ReadAllFile(dirPath, options = {}) {
  if (!existsSync(dirPath)) return []
  const defualtOptions = {
    suffix: false,
    ignoreSuffix: false,
    ignore: false
  }
  options = Object.assign(defualtOptions, options)

  let array = []
  const result = readdirSync(dirPath)
  for (const item of result) {
    const resolvePath = join(dirPath, item)

    // 忽略文件|目录
    const isIgnore = options.ignore && item.includes(options.ignore)
    if (isIgnore) continue

    // 忽略指定文件后缀
    const isIgnoreSuffix = options.ignoreSuffix && extname(item).includes(options.ignoreSuffix)
    if (isIgnoreSuffix) continue

    // 读取文件信息
    const stat = statSync(resolvePath)

    // 文件 合并
    if (stat.isFile()) {
      // 读取指定文件后缀名
      if (options.suffix) {
        const isSuffix = extname(item).includes(options.suffix)
        if (isSuffix) array.push(resolvePath)
      } else {
        array.push(resolvePath)
      }
      continue
    }

    // 目录 递归
    if (stat.isDirectory()) {
      const resultArr = ReadAllFile(resolvePath, options)
      array = [...array, ...resultArr]
    }
  }
  return array
}

module.exports = ReadAllFile
