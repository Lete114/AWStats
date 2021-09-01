// deploy 部署

const fs = require('fs'),
  path = require('path'),
  git = require('simple-git'),
  yaml = require('js-yaml'),
  { removeAll, copy_before, parseConfigFile, resolve } = require('./utils')

module.exports = function () {
  const root_config = parseConfigFile('/config.yml') // 解析配置文件
  const generate_path = resolve('/' + root_config.public) // 获取生成路径
  const git_deploy_path = resolve('/.deploy_git')
  const force = root_config.deploy.force == true ? '-f' : ''
  const remote = root_config.deploy.remote
  const branch = root_config.deploy.branch
  const commitMsg = root_config.deploy.commitMsg || `updated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
  const repoURL = root_config.deploy.repoURL
  var args = []
  args.push(force, remote, branch)
  if (force == '') args.shift()

  if (fs.existsSync(git_deploy_path)) removeAll(git_deploy_path)

  console.log(`[INFO] Clone branch: ${branch} ...`)

  git()
    .clone(repoURL, git_deploy_path, branch)
    .then(() => {
      // 将public(生成)目录的所有文件复制到.deploy_git目录下
      copy_before(generate_path, git_deploy_path)
      console.log(`[INFO] Push ...`)
      git(git_deploy_path)
        .add('.')
        .commit(commitMsg)
        .push(args)
        .then(() => {
          console.log(`[INFO] Push to ${branch} success`)
        })
        .catch((error) => {
          console.error('[ERROR] push失败(请确保仓库已存在指定分支)')
          console.error(error)
        })
    })
}
