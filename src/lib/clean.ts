// clean 清理

import { remove, existsSync } from 'fs-extra'
import logger from '../utils/logger'
import { GetConfig, resolvePath } from '../utils'

export default async function () {
  const config = GetConfig()
  const publicDir = resolvePath(config.public)

  logger.info('Clean ...')

  if (!existsSync(publicDir)) {
    logger.info('It seems very Clean')
    return
  }

  await remove(publicDir)

  logger.info('Already Clean')
}
