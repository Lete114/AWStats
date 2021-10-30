const version = require('../package.json').version
const { readFileSync, writeFileSync, existsSync } = require('fs')
const { resolvePath, CopyDirFile } = require('./index')

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
  // 将主题的静态资源(static)复制到生成路径(public)
  const themeStatic = resolvePath(`/themes/${theme}/static`)
  const isStatic = existsSync(themeStatic)
  if (isStatic) CopyDirFile(themeStatic, publicDir)

  // 将根目录的静态资源(static)复制到生成路径(public)
  const rootSourcePath = resolvePath('/source')
  const isSource = existsSync(rootSourcePath)
  if (isSource) CopyDirFile(rootSourcePath, publicDir)
}

module.exports = { SetVersion, CopyStatic }
