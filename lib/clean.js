// clean 清理

const fs = require('fs'),
  path = require('path'),
  yaml = require('js-yaml'),
  { removeAll, parseConfigFile, resolve } = require('./utils')


module.exports = function () {
  const root_config = parseConfigFile('/config.yml') // 解析配置文件
  const public_dir = resolve('/' + root_config.public) // 获取生成路径
  
  console.log('[INFO] Clean...')
  // 判断public目录是否存在
  if (fs.existsSync(public_dir)) {
    removeAll(public_dir) // 存在则删除
    console.log('[INFO] 已清理')
  } else {
    console.log('[INFO] 似乎很干净')
  }
}
