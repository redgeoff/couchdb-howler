import socketIO from 'socket.io'
import log from './log'

class Server {
  constructor (opts) {
    this._port = opts.port
    this._io = socketIO()
    this._sockets = []
  }

  start () {
    this._io.on('connection', socket => {
      this._sockets.push(socket)

      socket.on('subscribe', (dbName, callback) => {
        // TODO
        log.info('dbName=%s', dbName)

        // Ack
        callback(dbName)
      })

      socket.on('unsubscribe', (dbName, callback) => {
        // TODO
        log.info('dbName=%s', dbName)

        // Ack
        callback(dbName)
      })

      socket.on('disconnect', () => {
        // Socket closed
        this._sockets.splice(this._sockets.indexOf(socket), 1)
      })
    })

    this._io.listen(this._port)
  }

  stop () {
    // Stop accepting connections
    this._io.close()

    // Close each socket connection
    this._sockets.forEach(socket => socket.disconnect())
  }
}

module.exports = Server
