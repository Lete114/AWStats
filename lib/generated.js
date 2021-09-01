// build 构建生成
const fs = require('fs'),
  path = require('path'),
  ejs = require('ejs'),
  { removeAll, copy_before, resolve, parseConfigFile } = require('./utils')

module.exports = function () {
  // 获取根目录配置文件
  const root_config = parseConfigFile('/config.yml') // 解析配置文件
  const public_dir = resolve('/' + root_config.public) // 获取渲(生成)染结果路径
  const theme_dir = root_config.theme // 获取主题

  // 获取主题配置文件
  let theme_config = parseConfigFile(`/themes/${theme_dir}/config.yml`) // 获取主题配置文件
  // 获取根目录的主题配置文件
  const root_theme_config_file = `/config.${theme_dir}.yml`
  const is_exists = fs.existsSync(resolve(root_theme_config_file)) // 是否存在该文件
  if (is_exists) {
    let root_theme_config = parseConfigFile(resolve(root_theme_config_file))
    theme_config = Object.assign(theme_config, root_theme_config)
  }
  const ConfigData = { config: root_config, theme: theme_config } // 合并配置文件和主题配置文件

  console.log('[INFO] Generated...')

  // 判断public目录是否存在  存在则删除
  if (fs.existsSync(public_dir)) removeAll(public_dir)
  fs.mkdirSync(public_dir) // 新建public

  // 将主题的静态资源(static)复制到生成路径(public)
  const static_theme = resolve(`/themes/${theme_dir}/static`)
  copy_before(static_theme, public_dir)

  // 解析ejs
  const template = resolve(`/themes/${theme_dir}/template`)
  parse_ejs(template)
  function parse_ejs(template) {
    var files = fs.readdirSync(template) // 获取template下的所有文件
    // 遍历所有文件
    for (let item of files) {
      let file_path = path.resolve(`${template}/${item}`)
      // 获取文件状态
      const stats = fs.statSync(file_path)
      // 文件不是文件夹，且为.ejs后缀文件则进入
      if (!stats.isDirectory() && path.extname(item) === '.ejs') {
        // 开始解析ejs
        ejs.renderFile(file_path, ConfigData, (err, HTMLData) => {
          if (err) console.log(err)
          else {
            // 过滤后缀名(.ejs)
            const base_name = path.basename(file_path, '.ejs')
            // 新建html文件
            const html = path.resolve(`${public_dir}/${base_name}.html`)
            fs.writeFile(html, HTMLData, 'utf8', (error) => {
              if (error) {
                console.log(error)
                return false
              }
            })
          }
        })
      }
    }
  }

  console.log('[INFO] 已完成')
}
