import socketIO from 'socket.io'
import log from './log'
import Notifier from './notifier'

class Server {
  constructor (opts) {
    this._port = opts.port
    this._io = socketIO()
    this._sockets = []
    this._notifier = new Notifier()
  }

  _onConnection () {
    this._io.on('connection', socket => {
      this._logSocketInfo(socket, 'connection')

      this._sockets.push(socket)
      this._onSubscribe(socket)
      this._onUnsubscribe(socket)
      this._onDisconnect(socket)
    })
  }

  _logSocketInfo (socket, msg) {
    log.info(
      {
        socketId: socket.id,
        remoteAddress: socket.conn.remoteAddress
      },
      msg
    )
  }

  _onSubscribe (socket) {
    socket.on('subscribe', (dbName, callback) => {
      this._logSocketInfo(socket, 'subscribe to dbName=' + dbName)

      this._notifier.subscribe(socket, dbName)

      // Ack
      callback(dbName)
    })
  }

  _onUnsubscribe (socket) {
    socket.on('unsubscribe', (dbName, callback) => {
      this._logSocketInfo(socket, 'unsubscribe from dbName=' + dbName)

      this._notifier.unsubscribe(socket, dbName)

      // Ack
      callback(dbName)
    })
  }

  _onDisconnect (socket) {
    socket.on('disconnect', () => {
      this._logSocketInfo(socket, 'disconnect')
      this._sockets.splice(this._sockets.indexOf(socket), 1)
    })
  }

  start () {
    this._onConnection()
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
