// utils 工具

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const logger = require('./logger')

/**
 *  获取绝对路径
 * @param {*} Path 路径，必须以‘/’开头
 * @returns 绝对路径完整地址
 */
function resolvePath(Path) {
  let root_dir = process.cwd()
  return path.join(root_dir , Path)
}

/**
 * 解析配置文件
 * @param {*} filePath 文件路径
 * @returns Config JSON
 */
function parseConfigFile(filePath) {
  const configFilePath = resolvePath(filePath)
  return yaml.load(fs.readFileSync(configFilePath, { encoding: 'utf8' })) // 解析配置文件
}

/**
 * 复制文件
 * @param {*} sourcesPath 原文件路径
 * @param {*} attachPath 指定输出路径
 */
function fileCopy(sourcesPath, attachPath) {
  fs.stat(sourcesPath, (err, stat) => {
    if (err) throw err
    if (stat.isFile()) {
      // 创建读取流
      let readable = fs.createReadStream(sourcesPath)
      // 创建写入流
      let writable = fs.createWriteStream(attachPath)

      readable.on('data', (chunk) => {
        writable.write(chunk)
      })
      readable.on('end', () => {
        writable.end()
      })
    }
  })
}

/**
 * 复制一个文件夹下的文件到另一个文件夹
 * @param src 源文件夹
 * @param newSrc 目标文件夹
 */
function copy(src, newSrc) {
  // 读取目录中的所有文件/目录
  fs.readdir(src, (err, paths) => {
    if (err) throw err
    paths.forEach((_path) => {
      const _src = path.resolve(`${src}/${_path}`)
      const _newSrc = path.resolve(`${newSrc}/${_path}`)
      if (fs.existsSync(_newSrc)) {
        const cwdPath = process.cwd()+path.sep
        const publicRelativePath =_newSrc.replace(cwdPath,'')
        const sourcesRelativePath =_src.replace(cwdPath,'')
        logger.warn('the target file already exists',sourcesRelativePath,'--->',publicRelativePath)
      }
      fs.stat(_src, (err, stat) => {
        if (err) throw err
        // 判断是否为文件
        if (stat.isFile()) {
          // 创建读取流
          let readable = fs.createReadStream(_src)
          // 创建写入流
          let writable = fs.createWriteStream(_newSrc)

          readable.on('data', (chunk) => {
            writable.write(chunk)
          })
          readable.on('end', () => {
            writable.end()
          })
          return
        }
        // 如果是目录则递归调用自身
        if (stat.isDirectory()) {
          // 如果路径存在，则返回 true，否则返回 false
          if (fs.existsSync(_newSrc)) copy(_src, _newSrc)
          else fs.mkdir(_newSrc, () => copy(_src, _newSrc))
        }
      })
    })
  })
}

/**
 * 删除目录下的所有文件及目录，包括当前目录
 * @param path 需要删除的路径文件夹
 */
function removeAll(_path) {
  const files = fs.readdirSync(_path)
  for (let item of files) {
    const file_path = path.resolve(`${_path}/${item}`)
    const stats = fs.statSync(file_path)
    if (stats.isDirectory()) removeAll(file_path)
    else fs.unlinkSync(file_path) //删除文件
  }
  fs.rmdirSync(_path) // 删除文件夹
}

module.exports = { copy, removeAll, resolvePath, parseConfigFile, fileCopy }
