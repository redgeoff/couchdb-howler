import sporks from 'sporks'
import log from './log'

class Sockets {
  constructor () {
    this._sockets = {}
    this._socketsByDBName = {}
  }

  add (socket) {
    if (!this._sockets[socket.id]) {
      this._sockets[socket.id] = {
        socket: socket,
        dbNames: {}
      }
    }
  }

  remove (socket) {
    // Remove any corresponding entries in socketsByDBName
    sporks.each(this._sockets[socket.id].dbNames, (key, dbName) => {
      this._unsubscribeFromDB(socket, dbName)
    })

    // Remove the socket
    delete this._sockets[socket.id]
  }

  get (id) {
    return this._sockets[id]
  }

  getByDBName (dbName) {
    return this._socketsByDBName[dbName]
  }

  setCookie (socket, cookie) {
    this._sockets[socket.id].cookie = cookie
  }

  getCookie (socket) {
    return this._sockets[socket.id].cookie
  }

  // clearCookie (socket) {
  //   delete this._sockets[socket.id].cookie
  // }

  _addDBToSockets (socket, dbName) {
    this._sockets[socket.id].dbNames[dbName] = true
  }

  _addDBToSocketsByDBName (socket, dbName) {
    if (!this._socketsByDBName[dbName]) {
      this._socketsByDBName[dbName] = {}
    }

    this._socketsByDBName[dbName][socket.id] = socket
  }

  _subscribeToDB (socket, dbName) {
    this._addDBToSockets(socket, dbName)
    this._addDBToSocketsByDBName(socket, dbName)
  }

  subscribe (socket, dbNames) {
    dbNames.forEach(dbName => this._subscribeToDB(socket, dbName))
  }

  _removeDBFromSockets (socket, dbName) {
    delete this._sockets[socket.id].dbNames[dbName]
  }

  _removeDBFromSocketsByDBName (socket, dbName) {
    if (this._socketsByDBName[dbName]) {
      delete this._socketsByDBName[dbName][socket.id]
    }

    // No more sockets for this dbName?
    if (sporks.length(this._socketsByDBName[dbName]) === 0) {
      delete this._socketsByDBName[dbName]
    }
  }

  _unsubscribeFromDB (socket, dbName) {
    this._removeDBFromSockets(socket, dbName)
    this._removeDBFromSocketsByDBName(socket, dbName)
  }

  unsubscribe (socket, dbNames) {
    dbNames.forEach(dbName => this._unsubscribeFromDB(socket, dbName))
  }

  close () {
    // Close each socket connection
    sporks.each(this._sockets, socket => {
      socket.socket.disconnect()
      this.remove(socket.socket)
    })
  }

  log (socket, msg) {
    log.info(
      {
        socketId: socket.id,
        remoteAddress: socket.conn.remoteAddress
      },
      msg
    )
  }

  emitChangeForDBName (dbName) {
    let sockets = this.getByDBName(dbName)

    // Are there any subscribers to this DB?
    if (sockets) {
      sporks.each(sockets, socket => {
        this.log(socket, dbName + ' changed')
        socket.emit('change', dbName)
      })
    }
  }
}

module.exports = Sockets
