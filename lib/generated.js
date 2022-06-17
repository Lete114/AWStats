// build 构建生成
const { writeFileSync, existsSync, mkdirSync, statSync } = require('fs')
const { join, extname } = require('path')
const { EjsRenderer } = require('./renderer')
const logger = require('../utils/logger')
const { SetVersion, CopyStatic } = require('../utils/generatedUtils')
const { GetConfig, GetThemeConfig, ReadAllFile, CreateDirPath, Clear, resolvePath } = require('../utils')

module.exports = async function () {
  SetVersion()
  const config = GetConfig()
  const theme = GetThemeConfig(config.theme)
  const publicDir = resolvePath(config.public)
  const ConfigData = { config, theme }

  logger.info('Generated ...')

  // 判断public目录是否存在  存在则删除
  if (existsSync(publicDir)) Clear(publicDir)
  mkdirSync(publicDir)

  // 复制静态文件
  CopyStatic(config.theme, publicDir)

  // 获取模板路径
  const templateDir = resolvePath(`/themes/${config.theme}/template`)
  const templatePath = ReadAllFile(templateDir)

  // 解析Template
  for (let file of templatePath) {
    const stats = statSync(file) // 获取文件状态

    const HTMLData = await EjsRenderer(file, ConfigData)

    const reg = /\.ejs$/i
    const filePath = file.replace(reg, '.html').replace(templateDir, '')

    if (!reg.test(file)) continue
    const htmlPath = join(`${publicDir}/${filePath}`)

    CreateDirPath(htmlPath)
    writeFileSync(htmlPath, HTMLData, 'utf8')
  }

  logger.info('Already Success')
}
