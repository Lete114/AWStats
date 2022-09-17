import { join, extname } from 'path'
import { statSync, readdirSync, existsSync } from 'fs'

/**
 * 读取一个目录下的所有文件
 * @param {String} dirPath 目标目录
 * @param {Object} options 选项:
 * @returns {Array}
 */
// eslint-disable-next-line max-statements
function ReadAllFile(
  dirPath: string,
  options?: {
    suffix?: false | string[]
    ignoreSuffix?: false | string[]
    ignore?: false | string[]
  }
): string[] {
  if (!existsSync(dirPath)) return []
  const defualtOptions = {
    suffix: false,
    ignoreSuffix: false,
    ignore: false
  }
  options = Object.assign(defualtOptions, options)

  let array: string[] = []
  const result = readdirSync(dirPath)
  for (const item of result) {
    const resolvePath = join(dirPath, item)

    // 忽略文件|目录
    const isIgnore = options.ignore && options.ignore.includes(item)
    if (isIgnore) continue

    // 忽略指定文件后缀
    const isIgnoreSuffix = options.ignoreSuffix && options.ignoreSuffix.includes(extname(item))
    if (isIgnoreSuffix) continue

    // 读取文件信息
    const stat = statSync(resolvePath)

    // 文件 合并
    if (stat.isFile()) {
      // 读取指定文件后缀名
      if (options.suffix) {
        const isSuffix = options.suffix.includes(extname(item))
        // eslint-disable-next-line max-depth
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

export default ReadAllFile
