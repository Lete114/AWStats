// deploy 部署

import { existsSync, copy, remove, move } from 'fs-extra'
import spawn from 'cross-spawn'
import logger from '../utils/logger'
import { GetConfig, resolvePath } from '../utils'
import { CommonSpawnOptions } from 'child_process'
import { join } from 'path'

const config = GetConfig()
const generatePath = resolvePath(config.public)
const gitDeployPath = resolvePath('.deploy_git')
const gitDeployPathTemp = join(gitDeployPath, '__awstats__temp__')
const force = config.deploy.force ? '-f' : ''
const remote = config.deploy.remote
const branch = config.deploy.branch
const commitMsg =
  config.deploy.commitMsg || `updated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
const repoURL = config.deploy.repoURL

const args = []
args.push(force, remote, branch)
if (!force) args.shift()

const options: CommonSpawnOptions = { stdio: 'inherit' }

export default async function () {
  if (!existsSync(generatePath)) {
    logger.err('Please build before you deploy')
    return
  }

  if (existsSync(gitDeployPath)) await remove(gitDeployPath)

  logger.info(`Clone branch: ${branch} ...`)

  try {
    spawn.sync('git', ['clone', '-b', branch, repoURL, gitDeployPathTemp], options)
    // 判断是否clone成功，否则不继续执行
    if (!existsSync(gitDeployPath)) {
      logger.err('Deployment failed. Please try again later')
      return
    }

    await move(join(gitDeployPathTemp, '.git'), join(gitDeployPath, '.git'))

    await remove(gitDeployPathTemp)
  } catch (error) {
    logger.error('No warehouse detected')
  }

  await copy(config.public, gitDeployPath)

  logger.info('Push ...')

  const cwdOpt = { ...options, ...{ cwd: gitDeployPath } }
  spawn.sync('git', ['add', '.'], cwdOpt)
  spawn.sync('git', ['status'], cwdOpt)
  spawn.sync('git', ['commit', `-m'${commitMsg}'`], cwdOpt)
  spawn.sync('git', ['push', force, remote, branch], cwdOpt)
}
