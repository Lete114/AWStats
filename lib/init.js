
const path = require('path')
const git = require('simple-git')
const { resolve,fileCopy } = require('./utils')

module.exports = function () {
  const configFilePath = path.resolve(__dirname + '/../config.yml')
  const RootConfigFilePath = resolve('/config.yml')
  const HomePageConfigFilePath = path.resolve(__dirname + '/../themes/HomePage/config.yml')
  const RootHomePageConfigFilePath = resolve('/config.HomePage.yml')

  const localPath = resolve('/themes/HomePage')

  const repoURL = 'git@github.com:lete114/AWStats-Themes-HomePage.git'

  console.log(`[INFO] Clone ...`)

  try {
    git()
      .clone(repoURL, localPath)
      .then(() => {
        fileCopy(configFilePath,RootConfigFilePath)
        fileCopy(HomePageConfigFilePath,RootHomePageConfigFilePath)
        console.log(`[INFO] Clone success`)
      })
  } catch (error) {
    console.log(`[INFO] Clone failure`)
    console.log(error)
  }
}
