/* eslint-disable @typescript-eslint/no-explicit-any */
import { extname, join } from 'path'
import UglifyJS from 'uglify-js'
import CleanCSS from 'clean-css'
import { minify as minifyHTML } from 'html-minifier'
import logger from './logger'
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, PathLike } from 'fs'

// 获取所有已生成的html，css，js文件
function reader(dir: PathLike, config: any) {
  let results: any = []
  if (!existsSync(dir)) return

  const list = readdirSync(dir)
  list.forEach((file) => {
    file = join(`${dir}/${file}`)
    const stat = statSync(file)
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
function minify(arr: string[], config: any) {
  if (!arr) return logger.warn('No compressed resources, build to generate static resources first')
  // 计数
  let html = 0
  let css = 0
  let js = 0
  logger.info('Minify...')
  // eslint-disable-next-line max-statements
  arr.forEach(async (filepath) => {
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
      const fileStr = readFileSync(filepath, 'utf-8')
      const { styles } = await new CleanCSS(configCss.options).minify(fileStr)
      writeFileSync(filepath, styles)
      css++
    }
    if (JS) {
      const fileStr = readFileSync(filepath, 'utf-8')
      const { code } = UglifyJS.minify(fileStr, configJs.options)
      writeFileSync(filepath, code)
      js++
    }
  })
  if (config.minify.log) {
    logger.info(`Already compress HTML: ${html}`)
    logger.info(`Already compress CSS: ${css}`)
    logger.info(`Already compress JavaScript: ${js}`)
  }
}

export { reader, minify }
