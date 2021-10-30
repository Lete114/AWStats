// minify 压缩

const { GetConfig, resolvePath } = require('../utils')
const { reader, minify } = require('../utils/minifyUtils')

// 默认配置
const defaultConfig = {
  js: { enable: true, options: {} },
  css: { enable: true, options: {} },
  html: {
    enable: true,
    options: {
      minifyJS: true, // Compressed JavaScript
      minifyCSS: true, // CSS Compressed
      removeComments: true, // Remove the comments
      collapseWhitespace: true, // Delete any extra space
      removeAttributeQuotes: true // Delete attribute quotes
    }
  }
}

module.exports = function () {
  const config = GetConfig()
  const generatePath = resolvePath('/' + config.public)

  const minifyConfig = Object.assign(config.minify, defaultConfig)
  config.minify = minifyConfig

  // 读取已生成的资源
  const resultFile = reader(generatePath, config)

  // 压缩
  minify(resultFile, config)
}
