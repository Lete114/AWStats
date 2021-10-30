// deploy 部署

const { existsSync } = require('fs')
const spawn = require('cross-spawn')
const logger = require('../utils/logger')
const { DeepClone, GetConfig, Clear, resolvePath } = require('../utils')

const options = { stdio: 'inherit' }

module.exports = function () {
  const config = GetConfig()
  const generatePath = resolvePath(config.public)
  const gitDeployPath = resolvePath('.deploy_git')
  const force = config.deploy.force ? '-f' : ''
  const remote = config.deploy.remote
  const branch = config.deploy.branch
  const commitMsg = config.deploy.commitMsg || `updated: ${new Date().toLocaleDateString()} ${new Date().toLoccdaleTimeString()}`
  const repoURL = config.deploy.repoURL

  if (!existsSync(generatePath)) {
    logger.err('Please build before you deploy')
    return
  }

  var args = []
  args.push(force, remote, branch)
  if (!force) args.shift()

  if (existsSync(gitDeployPath)) Clear(gitDeployPath)

  logger.info(`Clone branch: ${branch} ...`)

  spawn.sync('git', ['clone', '-b', branch, repoURL, gitDeployPath], options)

  // 判断是否clone成功，否则不继续执行
  if (!existsSync(gitDeployPath)) {
    logger.err('Deployment failed. Please try again later')
    return
  }

  spawn.sync('cp', ['-rf', `${config.public}/*`, gitDeployPath], options)

  logger.info(`Push ...`)

  const newOptions = DeepClone(options)
  newOptions.cwd = gitDeployPath
  spawn.sync('git', ['add', '.'], newOptions)
  spawn.sync('git', ['status'], newOptions)
  spawn.sync('git', ['commit', `-m'${commitMsg}'`], newOptions)
  spawn.sync('git', ['push', force, remote, branch], newOptions)
}
