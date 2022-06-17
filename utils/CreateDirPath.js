const { parse } = require('path')
const { existsSync, mkdirSync, statSync } = require('fs')

/**
 * 根据一个路径创建目录
 * @param {String} path 路径
 */
function CreateDirPath(path) {
  const dirs = []

  getAllDir(path)
  function getAllDir(tempPath) {
    if (parse(tempPath).ext) tempPath = parse(tempPath).dir
    dirs.push(tempPath)
    const { root, dir, ext } = parse(tempPath)
    if (!ext && root !== dir) getAllDir(dir)
  }

  for (const d of dirs.reverse()) {
    if (!existsSync(d)) mkdirSync(d)
  }
}

module.exports = CreateDirPath
