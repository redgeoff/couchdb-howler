import sporks from 'sporks'

class Notifier {
  constructor () {
    this._sockets = {}
    this._socketsByDBName = {}
  }

  _addToSockets (socket, dbName) {
    if (!this._sockets[socket.id]) {
      this._sockets[socket.id] = {
        socket: socket,
        dbNames: []
      }
    }

    this._sockets[socket.id].dbNames[dbName] = true
  }

  _addToSocketsByDBName (socket, dbName) {
    if (!this._socketsByDBName[dbName]) {
      this._socketsByDBName[dbName] = {}
    }

    this._socketsByDBName[dbName][socket.id] = socket
  }

  subscribe (socket, dbName) {
    this._addToSockets(socket, dbName)
    this._addToSocketsByDBName(socket, dbName)
  }

  _removeFromSockets (socket, dbName) {
    delete this._sockets[socket.id].dbNames[dbName]

    // No more dbNames for this socket?
    if (sporks.length(this._sockets[socket.id].dbNames) === 0) {
      delete this._sockets[socket.id]
    }
  }

  _removeFromSocketsByDBName (socket, dbName) {
    delete this._socketsByDBName[dbName][socket.id]

    // No more sockets for this dbName?
    if (sporks.length(this._socketsByDBName[dbName]) === 0) {
      delete this._socketsByDBName[dbName]
    }
  }

  _unsubscribeDBName (socket, dbName) {
    this._removeFromSockets(socket, dbName)
    this._removeFromSocketsByDBName(socket, dbName)
  }

  unsubscribe (socket, dbName) {
    if (!dbName) {
      // No dbName specified so remove from all dbNames
      this._sockets[socket.id].dbNames.forEach(dbName => {
        this._unsubscribeDBName(socket, dbName)
      })
    } else {
      this._unsubscribeDBName(socket, dbName)
    }
  }
}

module.exports = Notifier
