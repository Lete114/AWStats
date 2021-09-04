const fs = require('fs')
const path = require('path')
const git = require('simple-git')
const spawn = require('cross-spawn')
const version = require('../package.json').version
const logger = require('./logger')
const { removeAll, resolvePath, fileCopy } = require('../utils')

module.exports = function () {
  const thisPath = path.resolve(__dirname + '/../source')

  const configFilePath = path.join(thisPath, '/defaultConfig.yml')

  const RootConfigFilePath = resolvePath('/config.yml')

  const HomePageConfigFilePath = resolvePath('/themes/HomePage/config.yml')
  const RootHomePageConfigFilePath = resolvePath('/config.HomePage.yml')

  const PkgFilePath = path.join(thisPath, '/package.json')
  const RootPkgFilePath = resolvePath('/package.json')

  const localPath = resolvePath('/themes/HomePage')

  const repoURL = 'git@github.com:lete114/AWStats-Theme-HomePage.git'

  logger.info('Clone ...')

  try {
    const themeConfigExists = path.join(localPath, 'config.yml')
    if (fs.existsSync(themeConfigExists)) {
      logger.warn('Already Initialize pass')
      return
    }
    removeAll(localPath)

    git()
      .clone(repoURL, localPath)
      .then(() => {
        fileCopy(PkgFilePath, RootPkgFilePath)

        setTimeout(() => {
          const pkg = fs.readFileSync(RootPkgFilePath, { encoding: 'utf-8' })
          let pkgJson = JSON.parse(pkg)
          pkgJson.awstats.version = version
          fs.writeFileSync(RootPkgFilePath, JSON.stringify(pkgJson, null, 2), { encoding: 'utf-8' })
          spawn('npm', ['install'], { stdio: 'inherit' })
        }, 200)

        fileCopy(configFilePath, RootConfigFilePath)
        fileCopy(HomePageConfigFilePath, RootHomePageConfigFilePath)
        logger.info('Clone success')
      })
  } catch (error) {
    logger.err('Clone failure')
    logger.err(error)
  }
}
