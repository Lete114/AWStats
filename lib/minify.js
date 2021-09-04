// minify 压缩

const path = require('path')
const fs = require('fs')
const UglifyJS = require('uglify-js')
const CleanCSS = require('clean-css')
const minifyHTML = require('html-minifier').minify
const logger = require('./logger')
const { parseConfigFile, resolvePath } = require('../utils')

module.exports = function () {
  const root_config = parseConfigFile('/config.yml')
  const generate_path = resolvePath('/' + root_config.public)

  // 获取所有已生成的html，css，js文件
  function reader(dir) {
    if (!fs.existsSync(dir)) return
    let results = []
    const list = fs.readdirSync(dir)
    list.forEach((file) => {
      file = path.resolve(`${dir}/${file}`)
      var stat = fs.statSync(file)
      if (stat.isDirectory()) {
        results = results.concat(reader(file))
      } else {
        // 过滤后缀名
        if (root_config.minify.html && path.extname(file) === '.html') {
          results.push(path.resolve(file))
        }
        if (root_config.minify.css && path.extname(file) === '.css') {
          results.push(path.resolve(file))
        }
        if (root_config.minify.js && path.extname(file) === '.js') {
          results.push(path.resolve(file))
        }
      }
    })
    return results
  }

  // 开始压缩
  function minify(arr) {
    if (!arr) return logger.warn('No compressed resources, build to generate static resources first')
    // 计数
    let html = 0,
      css = 0,
      js = 0
    logger.info('Minify...')
    arr.forEach((filepath) => {
      if (root_config.minify.html && path.extname(filepath) === '.html') {
        let fileStr = fs.readFileSync(filepath, 'utf-8')
        fileStr = minifyHTML(fileStr, {
          removeComments: true,
          collapseWhitespace: true,
          minifyJS: true,
          minifyCSS: true
        })
        fs.writeFileSync(filepath, fileStr)
        html++
      }
      if (root_config.minify.css && path.extname(filepath) === '.css') {
        let fileStr = fs.readFileSync(filepath, 'utf-8')
        fileStr = new CleanCSS({}).minify(fileStr)
        fs.writeFileSync(filepath, fileStr.styles)
        css++
      }
      if (root_config.minify.js && path.extname(filepath) === '.js') {
        let fileStr = fs.readFileSync(filepath, 'utf-8')
        fileStr = UglifyJS.minify(fileStr)
        fs.writeFileSync(filepath, fileStr.code)
        js++
      }
    })
    if (root_config.minify.log) {
      logger.info(`Already compress HTML: ${html}`)
      logger.info(`Already compress CSS: ${css}`)
      logger.info(`Already compress JavaScript: ${js}`)
    }
  }

  const resultFile = reader(generate_path)

  minify(resultFile)
}
