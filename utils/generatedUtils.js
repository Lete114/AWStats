const version = require('../package.json').version
const { readFileSync, writeFileSync, existsSync } = require('fs')
const { resolvePath, CopyFile, ReadAllFile,CreateDirPath } = require('./index')

/**
 * 设置package.json中AWStats版本
 */
function SetVersion() {
  const pkgPath = resolvePath('package.json')
  const pkg = readFileSync(pkgPath, { encoding: 'utf-8' })
  let pkgJson = JSON.parse(pkg)
  if (!pkgJson.awstats.version) {
    pkgJson.awstats.version = version
    writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2), { encoding: 'utf-8' })
  }
}

/**
 * 复制静态文件
 * @param {*} theme 主题昵称
 * @param {*} publicDir 生成文件路径
 */
function CopyStatic(theme, publicDir) {
  let paths = []

  // 将主题的静态资源(static)复制到生成路径(public)
  const themeStatic = resolvePath(`/themes/${theme}/static`)
  const isStatic = existsSync(themeStatic)
  if (isStatic) paths = [...paths, ...ReadAllFile(themeStatic)]

  // 将根目录的静态资源(static)复制到生成路径(public)
  const rootSourcePath = resolvePath('/source')
  const isSource = existsSync(rootSourcePath)
  if (isSource) paths = [...paths, ...ReadAllFile(rootSourcePath)]

  const mapper = {}
  for (const i of paths) mapper[i] = i.replace(themeStatic, publicDir).replace(rootSourcePath, publicDir)

  for (const k1 in mapper) {
    const v1 = mapper[k1]
    for (const k2 in mapper) {
      const v2 = mapper[k2]
      if (k1 !== k2 && v1 === v2) delete mapper[k1]
    }
  }
  for (const [k, v] of Object.entries(mapper)) {
    CreateDirPath(v)
    CopyFile(k, v)
  }
}

module.exports = { SetVersion, CopyStatic }
