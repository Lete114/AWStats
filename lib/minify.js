// minify 压缩

const path = require('path'),
  fs = require('fs'),
  UglifyJS = require('uglify-js'),
  CleanCSS = require('clean-css'),
  minifyHTML = require('html-minifier').minify,
  { parseConfigFile, resolve } = require('./utils')

module.exports = function () {
  const root_config = parseConfigFile('/config.yml') // 解析配置文件
  const generate_path = resolve('/' + root_config.public) // 获取生成路径

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
    if (!arr) return console.log('[INFO] No compressed resources, build to generate static resources first')
    // 计数
    let html = 0,
      css = 0,
      js = 0
    console.log('[INFO] Minify...')
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
      console.log(`[INFO] 已压缩html:${html}个`)
      console.log(`[INFO] 已压缩css:${css}个`)
      console.log(`[INFO] 已压缩js:${js}个`)
    }
  }

  minify(reader(generate_path))
}
