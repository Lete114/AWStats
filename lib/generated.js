// build 构建生成
const { writeFileSync, existsSync, mkdirSync, statSync } = require('fs')
const { join, extname } = require('path')
const ejs = require('ejs')
const logger = require('../utils/logger')
const { SetVersion, CopyStatic } = require('../utils/generatedUtils')
const { GetConfig, GetThemeConfig, readFile, CreateDirPath, Clear,  resolvePath, } = require('../utils')

module.exports = async function () {
  SetVersion()
  const config = GetConfig()
  const themeConfig = GetThemeConfig(config.theme)
  const publicDir = resolvePath('/' + config.public)
  const ConfigData = { config, theme: themeConfig }

  logger.info('Generated ...')

  // 判断public目录是否存在  存在则删除
  if (existsSync(publicDir)) Clear(publicDir)
  mkdirSync(publicDir)

  CopyStatic(config.theme, publicDir)

  // 解析ejs
  const templateDir = resolvePath(`/themes/${config.theme}/template`)
  const templatePath = readFile(templateDir)

  for (let file of templatePath) {
    const stats = statSync(file) // 获取文件状态

    const condition = !stats.isDirectory() && extname(file) === '.ejs'
    if (condition) {
      const HTMLData = await ejs.renderFile(file, ConfigData)

      // 过滤后缀名(.ejs)
      const filePath = file.replace(/\.ejs$/i, '.html').replace(templateDir, '')

      const htmlPath = join(`${publicDir}/${filePath}`)
      CreateDirPath(htmlPath, true)
      writeFileSync(htmlPath, HTMLData, 'utf8')
    }
  }

  logger.info('Already Success')
}
