import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import yaml from 'js-yaml'
import merge from 'deepmerge'
import logger from './logger'
import ReadAllFile from './ReadFile'
import { KV } from '../type'

/**
 *  获取绝对路径
 * @param {*} Path 路径，必须以‘/’开头
 * @returns 绝对路径完整地址
 */
function resolvePath(...path: string[]) {
  return join(process.cwd(), ...path)
}

/**
 * 解析配置文件
 * @param {String} filePath 文件路径
 * @returns {Object} Config JSON
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseConfigFile(filePath: string): any {
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function GetConfig(): any {
  // 获取配置文件绝对路径
  const configYaml = resolvePath('/config.yaml')
  const configYml = resolvePath('/config.yml')

  // 判断配置文件是否存在
  const isYaml = existsSync(configYaml)
  const isYml = existsSync(configYml)

  if (isYml) return parseConfigFile(configYml)
  if (isYaml) return parseConfigFile(configYaml)
  logger.err('Configuration file not found')
  return {}
}

/**
 * 获取主题配置文件
 * @param {String} theme 主题昵称
 * @returns {Object}
 */
function GetThemeConfig(theme: string): KV {
  if (!theme) return {}

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

  return merge(themeConfig, themeRootConfig)
}

export { resolvePath, DeepClone, parseConfigFile, GetConfig, GetThemeConfig, ReadAllFile }
