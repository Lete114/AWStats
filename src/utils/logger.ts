/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import chalk from 'chalk'

function info(...args: any[]) {
  console.log(chalk.hex('#57CC99').bold('[INFO]'), ...args)
}

function warn(...args: any[]) {
  console.log(chalk.hex('#FFB319').bold('[WARN]'), ...args)
}

function err(...args: any[]) {
  console.log(chalk.hex('#FF4848').bold('[ERROR]'), ...args)
}

const error = err

function custom() {
  return chalk
}

export default { info, warn, err, error, custom }
