import chokidar from 'chokidar'
import mime from 'mime'
import { readFile, existsSync } from 'fs'
import { extname } from 'path'
import { IncomingMessage, ServerResponse } from 'http'
import { EjsRenderer } from '../lib/renderer'
import { resolvePath, GetConfig, GetThemeConfig, ReadAllFile } from './index'
import { KV } from '../type'

// Watch 监听文件
const AllFile: KV = {}
let ConfigData: KV = {}
function watchServer(): void {
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
    let rootStatsAllPath: string[] = []
    let relativeRootStatsAllPath: string[] = []
    if (existsSync(rootStaticPath)) {
      rootStatsAllPath = ReadAllFile(rootStaticPath)
      relativeRootStatsAllPath = rootStatsAllPath.map((item) => item.replace(rootStaticPath, ''))
    }

    // 读取主题文件
    const staticAllPath = ReadAllFile(themeStaticPath)
    const relativeStaticAllPath = staticAllPath.map((item) => item.replace(themeStaticPath, ''))

    const templateAllPath = ReadAllFile(themeTemplatePath, { suffix: ['.ejs'] })
    const relativeTemplateAllPath = templateAllPath.map((item) => item.replace(themeTemplatePath, ''))

    const FileAll = [...staticAllPath, ...rootStatsAllPath, ...templateAllPath]
    const relativeFileAll = [...relativeStaticAllPath, ...relativeRootStatsAllPath, ...relativeTemplateAllPath]

    for (const item in relativeFileAll) {
      const ejs2Html = relativeFileAll[item].replace(/\\/g, '/').replace(/\.ejs$/i, '.html')
      AllFile[ejs2Html] = FileAll[item]
    }
  })
}

async function main(req: IncomingMessage, res: ServerResponse) {
  let pathname = req.url || ''

  // 自动匹配/index.html
  if (pathname.indexOf('.') === -1) pathname += 'index.html'

  const error404 = AllFile['/404.html']
  const path = AllFile[pathname] || ''
  if (path && extname(pathname) === '.html') {
    const data = await EjsRenderer(path, ConfigData)
    res.end(data)
    return
  }
  readFile(path, async (err, data) => {
    if (err) {
      if (!existsSync(error404)) return res.end('Not Find 404')
      const data = await EjsRenderer(error404, ConfigData)
      res.writeHead(404, { 'Content-Type': 'text/html;charset=utf8' })
      res.end(data)
      return
    }
    const mimeType = mime.getType(extname(pathname)) || 'text/plain'
    res.setHeader('Content-Type', mimeType)
    res.end(data)
  })
}

export { main, watchServer }
