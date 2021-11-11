const { resolve, sep } = require('path')
const logger = require('./logger')
const { readdir } = require('fs').promises
const { statSync, createReadStream, createWriteStream, existsSync, mkdir } = require('fs')

/**
 * 复制文件
 * @param {*} sourcesPath 原文件路径
 * @param {*} attachPath 指定输出路径
 */
function CopyFile(sourcesPath, attachPath) {
  const stat = statSync(sourcesPath)
  if (!stat.isFile()) return
  // 创建读取流
  let readable = createReadStream(sourcesPath)
  // 创建写入流
  let writable = createWriteStream(attachPath)
  readable.on('data', (chunk) => writable.write(chunk))
  readable.on('end', () => writable.end())
}

/**
 * 复制一个文件夹下的文件到另一个文件夹
 * @param src 源文件夹
 * @param newSrc 目标文件夹
 */
async function CopyDirFile(src, newSrc) {
  // 读取目录中的所有文件/目录
  const paths = await readdir(src)
  paths.forEach((path) => {
    const _src = resolve(`${src}/${path}`)
    const _newSrc = resolve(`${newSrc}/${path}`)
    if (existsSync(_newSrc)) {
      logger.warn('The target file already exists, which may cause some problems')
      console.log(logger.custom().hex('#FF4848').bold('Source File:'), _src)
      console.log(logger.custom().hex('#FF4848').bold('Target File:'), _newSrc)
      return
    }
    const stat = statSync(_src)
    // 判断是否为文件
    if (stat.isFile()) {
      // 创建读取流
      let readable = createReadStream(_src)
      // 创建写入流
      let writable = createWriteStream(_newSrc)

      readable.on('data', (chunk) => writable.write(chunk))
      readable.on('end', () => writable.end())
      return
    }
    // 如果是目录则递归调用自身
    if (stat.isDirectory()) {
      mkdir(_newSrc, () => CopyDirFile(_src, _newSrc))
    }
  })
}

module.exports = { CopyFile, CopyDirFile }
