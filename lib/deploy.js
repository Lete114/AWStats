// deploy 部署

const fs = require('fs')
const git = require('simple-git')
const logger = require('./logger')
const { removeAll, copy, parseConfigFile, resolvePath } = require('./utils')

module.exports = function () {
  const root_config = parseConfigFile('/config.yml')
  const generate_path = resolvePath('/' + root_config.public)
  const git_deploy_path = resolvePath('/.deploy_git')
  const force = root_config.deploy.force == true ? '-f' : ''
  const remote = root_config.deploy.remote
  const branch = root_config.deploy.branch
  const commitMsg = root_config.deploy.commitMsg || `updated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
  const repoURL = root_config.deploy.repoURL

  var args = []
  args.push(force, remote, branch)
  if (force == '') args.shift()

  if (fs.existsSync(git_deploy_path)) removeAll(git_deploy_path)

  logger.info(`Clone branch: ${branch} ...`)

  git()
    .clone(repoURL, git_deploy_path, branch)
    .then(() => {
      // 将public(生成)目录的所有文件复制到.deploy_git目录下
      copy(generate_path, git_deploy_path)
      logger.info(`Push ...`)
      git(git_deploy_path)
        .add('.')
        .commit(commitMsg)
        .push(args)
        .then(() => {
          logger.info(`Push to ${branch} Success`)
        })
        .catch((error) => {
          logger.err('Uush Failure (Ensure that the specified branch already exists in the warehouse)')
          console.error(error)
        })
    })
}
