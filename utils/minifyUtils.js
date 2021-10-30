const { extname, join } = require('path')
const UglifyJS = require('uglify-js')
const CleanCSS = require('clean-css')
const minifyHTML = require('html-minifier').minify
const logger = require('../utils/logger')
const { readFileSync, writeFileSync, existsSync, readdirSync, statSync } = require('fs')

// 获取所有已生成的html，css，js文件
function reader(dir, config) {
  let results = []
  if (!existsSync(dir)) return

  const list = readdirSync(dir)
  list.forEach((file) => {
    file = join(`${dir}/${file}`)
    var stat = statSync(file)
    if (stat.isDirectory()) {
      results = results.concat(reader(file, config))
    } else {
      // 过滤后缀名
      const minifyConfig = config.minify
      const html = minifyConfig.html.enable && extname(file) === '.html'
      const css = minifyConfig.css.enable && extname(file) === '.css'
      const js = minifyConfig.js.enable && extname(file) === '.js'

      if (html) results.push(join(file))
      if (css) results.push(join(file))
      if (js) results.push(join(file))
    }
  })
  return results
}

// 开始压缩
function minify(arr, config) {
  if (!arr) return logger.warn('No compressed resources, build to generate static resources first')
  // 计数
  let html = 0
  let css = 0
  let js = 0
  logger.info('Minify...')
  arr.forEach((filepath) => {
    const configHtml = config.minify.html
    const configCss = config.minify.css
    const configJs = config.minify.js

    const HTML = configHtml.enable && extname(filepath) === '.html'
    const CSS = configCss.enable && extname(filepath) === '.css'
    const JS = configJs.enable && extname(filepath) === '.js'

    if (HTML) {
      let fileStr = readFileSync(filepath, 'utf-8')
      fileStr = minifyHTML(fileStr, configHtml.options)
      writeFileSync(filepath, fileStr)
      html++
    }
    if (CSS) {
      let fileStr = readFileSync(filepath, 'utf-8')
      fileStr = new CleanCSS(configCss.options).minify(fileStr)
      writeFileSync(filepath, fileStr.styles)
      css++
    }
    if (JS) {
      let fileStr = readFileSync(filepath, 'utf-8')
      fileStr = UglifyJS.minify(fileStr, configJs.options)
      writeFileSync(filepath, fileStr.code)
      js++
    }
  })
  if (config.minify.log) {
    logger.info(`Already compress HTML: ${html}`)
    logger.info(`Already compress CSS: ${css}`)
    logger.info(`Already compress JavaScript: ${js}`)
  }
}

module.exports = { reader, minify }
