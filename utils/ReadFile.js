const { join, extname } = require('path')
const {statSync, readdirSync} = require('fs')

/**
 * 读取一个目录下的所有文件
 * @param {String} dirPath 目标目录
 * @param {Array} suffix 读取文件后缀
 * @param {Array} ignore 忽略文件|目录
 * @returns {Array|String}
 */
function ReadFile(dirPath, suffix = [], ignore = []) {
  let array = []
  const result = readdirSync(dirPath)
  for (const item of result) {
    const resolveParh = join(dirPath, item)

    // 忽略文件|目录
    const isIgnoreEmpty = ignore.length != 0
    const isIgnore = isIgnoreEmpty && item.includes(ignore)

    // 读取指定文件后缀
    const isExtnameEmpty = suffix.length != 0
    const isExtname = isExtnameEmpty && extname(resolveParh).includes(suffix)

    if (isIgnore) continue
    if (isExtname) continue

    // 读取文件信息
    const stat = statSync(resolveParh)

    const isFile = stat.isFile()
    const isDirectory = stat.isDirectory()
    if (isFile) {
      array.push(resolveParh)
    } else if (isDirectory) {
      const resultArr = ReadFile(resolveParh)
      array = [...array, ...resultArr]
    }
  }
  return array
}

module.exports = ReadFile
