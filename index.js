/**
 * AWStats 静态文件生成器
 * author: Lete乐特
 * Github: https://github.com/lete114/AWStats
 */

const generate = require('./lib/generated')
const minify = require('./lib/minify')
const server = require('./lib/server')
const deploy = require('./lib/deploy')
const clean = require('./lib/clean')

module.exports = { generate, minify, server, deploy, clean }
