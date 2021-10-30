const net = require('net')
const logger = require('../utils/logger')

async function portUsedStatus(port) {
  return new Promise((resolve, reject) => {
    let server = net.createServer().listen(port, '127.0.0.1')
    server.on('listening', function () {
      server.close()
      resolve(port)
    })
    server.on('error', function (err) {
      if (err.code == 'EADDRINUSE') {
        resolve(err)
      }
    })
  })
}

module.exports = async function tryConnetcUsablePort(port, portAvailableCallback) {
  let result = await portUsedStatus(port)
  if (result instanceof Error) {
    logger.warn(`detected ${port} port is occupied`)
    port++
    tryConnetcUsablePort(port, portAvailableCallback)
  } else {
    logger.info('Already For you Opening a new port ' + port)
    portAvailableCallback(port)
  }
}
