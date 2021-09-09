// build 构建生成
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const logger = require('./logger')
const version = require('../package.json').version
const { removeAll, copy, resolvePath, parseConfigFile } = require('../utils')

module.exports = function () {
  const pkgPath = resolvePath('package.json')
  const pkg = fs.readFileSync(pkgPath, { encoding: 'utf-8' })
  let pkgJson = JSON.parse(pkg)
  if (!pkgJson.awstats.version) {
    pkgJson.awstats.version = version
    fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2), { encoding: 'utf-8' })
  }

  const root_config = parseConfigFile('/config.yml')
  const public_dir = resolvePath('/' + root_config.public)
  const theme_dir = root_config.theme

  let theme_config = parseConfigFile(`/themes/${theme_dir}/config.yml`)

  const root_theme_config_file = `/config.${theme_dir}.yml`
  const is_exists = fs.existsSync(resolvePath(root_theme_config_file))
  if (is_exists) {
    let root_theme_config = parseConfigFile(root_theme_config_file)
    theme_config = Object.assign(theme_config, root_theme_config)
  }
  const ConfigData = { config: root_config, theme: theme_config }

  logger.info('Generated ...')

  // 判断public目录是否存在  存在则删除
  if (fs.existsSync(public_dir)) removeAll(public_dir)
  fs.mkdirSync(public_dir)

  // 将主题的静态资源(static)复制到生成路径(public)
  const static_theme = resolvePath(`/themes/${theme_dir}/static`)
  copy(static_theme, public_dir)

  const rootSourcePath = resolvePath('/source')
  const existsDir = fs.existsSync(rootSourcePath)
  if (existsDir) {
    setTimeout(() => copy(rootSourcePath, public_dir), 100)
  }

  // 解析ejs
  const template = resolvePath(`/themes/${theme_dir}/template`)
  parse_ejs(template)
  function parse_ejs(template) {
    fs.readdir(template, (err, files) => {
      if (err) logger.err(err)

      for (let item of files) {
        let file_path = path.resolve(`${template}/${item}`)

        const stats = fs.statSync(file_path) // 获取文件状态

        if (!stats.isDirectory() && path.extname(item) === '.ejs') {
          ejs.renderFile(file_path, ConfigData, (err, HTMLData) => {
            if (err) logger.err(err)
            else {
              // 过滤后缀名(.ejs)
              const base_name = path.basename(file_path, '.ejs')

              const html = path.resolve(`${public_dir}/${base_name}.html`)
              fs.writeFile(html, HTMLData, 'utf8', (error) => {
                if (error) {
                  logger.err(error)
                  return false
                }
              })
            }
          })
        }
      }
    })
  }

  logger.info('Already Success')
}
