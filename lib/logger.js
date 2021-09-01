const chalk = require('chalk')

function info(str) {
  console.log(chalk.hex('#57CC99').bold(`[INFO]`), str)
}

function warn(str) {
  console.log(chalk.hex('#FFB319').bold(`[WARN]`), str)
}

function err(str) {
  console.log(chalk.hex('#FF4848').bold(`[ERROR]`), str)
}

module.exports ={info,warn,err}
