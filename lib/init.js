const fs = require('fs')
const path = require('path')
const git = require('simple-git')
const logger = require('./logger')
const { resolve, fileCopy } = require('./utils')

module.exports = function () {

  const configFilePath = path.resolve(__dirname + '/../source/defaultConfig.yml')
  const RootConfigFilePath = resolve('/config.yml')
  const HomePageConfigFilePath = resolve('/themes/HomePage/config.yml')
  const RootHomePageConfigFilePath = resolve('/config.HomePage.yml')

  const localPath = resolve('/themes/HomePage')

  const repoURL = 'git@github.com:lete114/AWStats-Theme-HomePage.git'

  logger.info('Clone ...')

  try {
    if (fs.existsSync(localPath)) {
      logger.warn('Already Initialize pass')
      return
    }
    git()
      .clone(repoURL, localPath)
      .then(() => {
        fileCopy(configFilePath, RootConfigFilePath)
        fileCopy(HomePageConfigFilePath, RootHomePageConfigFilePath)
        logger.info('Clone success')
      })
  } catch (error) {
    logger.err('Clone failure')
    logger.err(error)
  }
}
