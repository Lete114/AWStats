// clean 清理

const fs = require('fs')
const logger = require('./logger')
const { removeAll, parseConfigFile, resolve } = require('./utils')

module.exports = function () {
  const root_config = parseConfigFile('/config.yml')
  const public_dir = resolve('/' + root_config.public)

  logger.info('Clean ...')

  if (!fs.existsSync(public_dir)) {
    logger.info('It seems very Clean')
    return
  }

  removeAll(public_dir)
  logger.info('Already Clean')
}
