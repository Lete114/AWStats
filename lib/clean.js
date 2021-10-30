// clean 清理

const fs = require('fs')
const logger = require('../utils/logger')
const { GetConfig, Clear, resolvePath } = require('../utils')

module.exports = function () {
  const config = GetConfig()
  const publicDir = resolvePath(config.public)

  logger.info('Clean ...')

  if (!fs.existsSync(publicDir)) {
    logger.info('It seems very Clean')
    return
  }

  Clear(publicDir)

  logger.info('Already Clean')
}
