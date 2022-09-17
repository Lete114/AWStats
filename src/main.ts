/**
 * AWStats 静态文件生成器
 * author: Lete乐特
 * Github: https://github.com/lete114/AWStats
 */

import generate from './lib/generated'
import minify from './lib/minify'
import server from './lib/server'
import deploy from './lib/deploy'
import clean from './lib/clean'

export { generate, minify, server, deploy, clean }
