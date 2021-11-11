const chalk = require('chalk')

function info() {
  console.log(chalk.hex('#57CC99').bold('[INFO]'), ...arguments)
}

function warn() {
  console.log(chalk.hex('#FFB319').bold('[WARN]'), ...arguments)
}

function err() {
  console.log(chalk.hex('#FF4848').bold('[ERROR]'), ...arguments)
}

function error() {
  err(...arguments)
}

function custom() {
  return chalk
}

module.exports = { info, warn, err, error, custom }
