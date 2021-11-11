const ejs = require('ejs')
const { extname } = require('path')
const {statSync} = require('fs')

async function renderer(file, config) {
  const stats = statSync(file)
  const condition = stats.isFile() && extname(file) === '.ejs'
  if (condition) return await ejs.renderFile(file, config)
  return ''
}

module.exports = renderer
