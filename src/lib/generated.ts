// build 构建生成
import { writeFileSync, existsSync, mkdirSync, mkdirs, remove } from 'fs-extra'
import { join, parse } from 'path'
import { EjsRenderer } from './renderer'
import logger from '../utils/logger'
import { SetVersion, CopyStatic } from '../utils/generatedUtils'
import { GetConfig, GetThemeConfig, ReadAllFile, resolvePath } from '../utils'

export default async function () {
  SetVersion()
  const config = GetConfig()
  const theme = GetThemeConfig(config.theme)
  const publicDir = resolvePath(config.public)
  const ConfigData = { config, theme }

  logger.info('Generated ...')

  // 判断public目录是否存在  存在则删除
  if (existsSync(publicDir)) await remove(publicDir)
  mkdirSync(publicDir)

  // 复制静态文件
  CopyStatic(config.theme, publicDir)

  // 获取模板路径
  const templateDir = resolvePath(`/themes/${config.theme}/template`)
  const templatePath = ReadAllFile(templateDir, { ignore: ['_modules'] })

  // 解析Template
  for (const file of templatePath) {
    const HTMLData = await EjsRenderer(file, ConfigData)

    const reg = /\.ejs$/i
    const filePath = file.replace(reg, '.html').replace(templateDir, '')

    if (!reg.test(file)) continue
    const htmlPath = join(`${publicDir}/${filePath}`)

    mkdirs(parse(htmlPath).dir)
    writeFileSync(htmlPath, HTMLData, 'utf8')
  }

  logger.info('Already Success')
}
