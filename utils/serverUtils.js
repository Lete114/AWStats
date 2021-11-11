const chokidar = require('chokidar')
const { readFile, existsSync } = require('fs')
const { join, extname } = require('path')
const { EjsRenderer } = require('../lib/renderer')
const { resolvePath, GetConfig, GetThemeConfig, ReadAllFile } = require('./index')

/**
 * 获取Mime类型
 * @param {*} extname
 * @param {*} callback
 */
function GetMime(extname) {
  const mimePath = join(__dirname, '../source/mime.json')
  return new Promise((resolve, reject) => {
    const mime = require(mimePath)
    resolve(mime[extname] || 'text/plain')
  })
}

/**
 * 处理404
 * @param {*} res
 * @param {*} public
 */
async function Handler404(res, path, ConfigData) {
  if (!existsSync(path)) return res.end('Not Find 404')
  const data = await EjsRenderer(path, ConfigData)
  res.writeHead(404, { 'Content-Type': 'text/html;charset=utf8' })
  res.end(data)
}

// Watch 监听文件
let AllFile = {}
let ConfigData = {}
;(function () {
  // 获取配置文件
  const config = GetConfig()
  const theme = GetThemeConfig(config.theme)
  ConfigData = { config, theme }
  const rootStaticPath = resolvePath('source')
  const themeStaticPath = resolvePath(`themes/${config.theme}/static`)
  const themeTemplatePath = resolvePath(`themes/${config.theme}/template`)

  // 获取配置文件路径(yml)
  const rootThemeYmlPath = resolvePath(`config.${config.theme}.yml`)
  const themeYmlPath = resolvePath(`themes/${config.theme}/config.yml`)
  // yaml
  const REG_YML = /\.yml$/i
  const YAML = 'yaml'
  const rootThemeYamlPath = rootThemeYmlPath.replace(REG_YML, YAML)
  const themeYamlPath = themeYmlPath.replace(REG_YML, YAML)

  // 监听主题配置文件
  const watchConfig = [rootThemeYmlPath, rootThemeYamlPath, themeYmlPath, themeYamlPath]
  chokidar.watch(watchConfig).on('all', () => {
    ConfigData = { config, theme: GetThemeConfig(config.theme) }
  })

  // 监听资源目录
  const watchDir = [rootStaticPath, themeStaticPath, themeTemplatePath]
  chokidar.watch(watchDir).on('all', () => {
    // 读取根目录静态文件
    const rootStatsAllPath = ReadAllFile(rootStaticPath)
    const relativeRootStatsAllPath = rootStatsAllPath.map((item) => item.replace(rootStaticPath, ''))

    // 读取主题文件
    const staticAllPath = ReadAllFile(themeStaticPath)
    const relativeStaticAllPath = staticAllPath.map((item) => item.replace(themeStaticPath, ''))

    const templateAllPath = ReadAllFile(themeTemplatePath, { suffix: ['.ejs'] })
    const relativeTemplateAllPath = templateAllPath.map((item) => item.replace(themeTemplatePath, ''))

    const FileAll = [...rootStatsAllPath, ...staticAllPath, ...templateAllPath]
    const relativeFileAll = [...relativeRootStatsAllPath, ...relativeStaticAllPath, ...relativeTemplateAllPath]

    for (const item in relativeFileAll) {
      const ejs2Html = relativeFileAll[item].replaceAll('\\', '/').replace(/\.ejs$/i, '.html')
      AllFile[ejs2Html] = FileAll[item]
    }
  })
})()

async function Main(req, res) {
  let pathname = req.url

  // 自动匹配/index.html
  if (pathname.indexOf('.') == -1) pathname += 'index.html'

  let flag = true
  for (const item in AllFile) {
    if (item === pathname) {
      flag = false
      if (extname(item) === '.html') {
        const data = await EjsRenderer(AllFile[item], ConfigData)
        res.end(data)
      } else {
        // 读取文件
        readFile(AllFile[item], async (err, data) => {
          if (err) return Handler404(res, AllFile['/404.html'], ConfigData)
          const mime = await GetMime(extname(pathname))
          res.writeHead(200, { 'Content-Type': mime })
          res.end(data)
        })
      }
    }
  }
  if (flag) Handler404(res, AllFile['/404.html'], ConfigData)
}

module.exports = { GetMime, Handler404, Main }
