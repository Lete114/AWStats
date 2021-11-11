// utils 工具

const { readFileSync } = require('fs')
const { join } = require('path')
const { existsSync } = require('fs')
const yaml = require('js-yaml')
const logger = require('./logger')
const { CopyFile, CopyDirFile } = require('./CopyFile')
const CreateDirPath = require('./CreateDirPath')
const ReadAllFile = require('./ReadFile')
const Clear = require('./Remove')

/**
 *  获取绝对路径
 * @param {*} Path 路径，必须以‘/’开头
 * @returns 绝对路径完整地址
 */
function resolvePath(...Path) {
  let root = process.cwd()
  return join(root, ...Path)
}

/**
 * 解析配置文件
 * @param {*} filePath 文件路径
 * @returns Config JSON
 */
function parseConfigFile(filePath) {
  const config = readFileSync(filePath, { encoding: 'utf8' })
  return yaml.load(config) // 解析配置文件
}

/**
 * 深度克隆
 * @param {Object|Array} obj
 * @returns {Object|Array}
 */
function DeepClone(obj = {}) {
  const str = JSON.stringify(obj)
  return JSON.parse(str)
}

/**
 * 获取配置文件
 * @returns {Object}
 */
function GetConfig() {
  // 获取配置文件绝对路径
  const configYaml = resolvePath('/config.yaml')
  const configYml = resolvePath('/config.yml')

  // 判断配置文件是否存在
  const isYaml = existsSync(configYaml)
  const isYml = existsSync(configYml)

  if (isYml) return parseConfigFile(configYml)
  else if (isYaml) return parseConfigFile(configYaml)

  logger.err('Configuration file not found')
}

/**
 * 获取主题配置文件
 * @param {String} theme 主题昵称
 * @returns {Object}
 */
function GetThemeConfig(theme) {
  if (!theme) return

  // 获取配置文件绝对路径
  const configThemeYaml = resolvePath(`/themes/${theme}/config.yaml`)
  const configThemeYml = resolvePath(`/themes/${theme}/config.yml`)
  const configRootThemeYaml = resolvePath(`/config.${theme}.yaml`)
  const configRootThemeYml = resolvePath(`/config.${theme}.yml`)

  // 判断配置文件是否存在
  const isYaml = existsSync(configThemeYaml)
  const isYml = existsSync(configThemeYml)
  const isRootYaml = existsSync(configRootThemeYaml)
  const isRootYml = existsSync(configRootThemeYml)

  // 解析主题配置文件
  let themeConfig = {}
  if (isYml) themeConfig = parseConfigFile(configThemeYml)
  else if (isYaml) themeConfig = parseConfigFile(configThemeYaml)
  else logger.err('Configuration file not found')

  // 解析根目录主题配置文件
  let themeRootConfig = {}
  if (isRootYml) themeRootConfig = parseConfigFile(configRootThemeYml)
  else if (isRootYaml) themeRootConfig = parseConfigFile(configRootThemeYaml)

  return Object.assign(themeConfig, themeRootConfig)
}

module.exports = {
  resolvePath,
  DeepClone,
  parseConfigFile,
  GetConfig,
  GetThemeConfig,
  ReadAllFile,
  CopyFile,
  CopyDirFile,
  CreateDirPath,
  Clear
}
