import net from 'net'
import logger from './logger'

async function portUsedStatus(port: number) {
  return new Promise((resolve) => {
    const server = net.createServer().listen(port, '127.0.0.1')
    server.on('listening', function () {
      server.close()
      resolve(port)
    })
    server.on('error', function () {
      resolve(false)
    })
  })
}

// eslint-disable-next-line no-unused-vars
export default async function tryConnetcUsablePort(port: number, availableCallback: (port: number) => void) {
  if (await portUsedStatus(port)) {
    logger.info('Already For you Opening a new port ' + port)
    availableCallback(port)
  } else {
    logger.warn(`detected ${port} port is occupied`)
    tryConnetcUsablePort(++port, availableCallback)
  }
}
