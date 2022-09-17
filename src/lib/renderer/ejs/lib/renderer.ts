import ejs from 'ejs'
import { extname } from 'path'
import { statSync } from 'fs'

async function renderer(file: string, config: object) {
  const stats = statSync(file)
  const condition = stats.isFile() && extname(file) === '.ejs'
  if (condition) return await ejs.renderFile(file, config)
  return ''
}

export default renderer
