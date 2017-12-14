import socketIO from 'socket.io'
import log from './log'
import Sockets from './sockets'
import utils from './utils'
import Slouch from 'couch-slouch'
import sporks from 'sporks'

class Server {
  constructor (opts) {
    this._port = opts.port
    this._io = socketIO()
    this._sockets = new Sockets()
    this._slouch = new Slouch(opts['couchdb-url'])
    this._iterator = null
  }

  async _logInOrVerifyLogin (socket, params) {
    let response = null

    if (params.cookie) {
      // A cookie was supplied so verify that it is valid
      response = await this._slouch.user.authenticated(params.cookie)
    } else {
      // Use the username and password to authenticate
      response = await this._slouch.user.authenticate(params.username, params.password)
    }

    this._sockets.add(socket)

    // Associate cookie with socket
    this._sockets.setCookie(socket, response.cookie)

    return response
  }

  _onAuthenticated (socket) {
    this._onLogOut(socket)
    this._onSubscribe(socket)
    this._onUnsubscribe(socket)
    this._onDisconnect(socket)
  }

  async _authenticate (socket) {
    try {
      let params = socket.handshake.query

      this._logSocketInfo(socket, 'authentication attempt')

      let response = await this._logInOrVerifyLogin(socket, params)

      this._logSocketInfo(socket, 'authentication success')
      socket.emit('authenticated', { cookie: response.cookie })

      this._onAuthenticated(socket)
    } catch (err) {
      this._logSocketInfo(socket, 'authentication failure=' + JSON.stringify(err))
      socket.emit('not-authenticated', err)
    }
  }

  _onConnection () {
    // We handle the authentication during the connection so that it is slightly harder for a DDOS
    // attack to exhaust our connection pool
    this._io.on('connection', async socket => {
      this._logSocketInfo(socket, 'connection')
      await this._authenticate(socket)
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

  _addSocketListener (opts) {
    opts.socket.on(opts.eventName, async (params, callback) => {
      await utils.respond(callback, async () => {
        await opts.promiseFactory(opts.socket, params)
      })
    })
  }

  _onLogOut (socket) {
    // We cannot use _addSocketListener as we need to respond before issuing the disconnect
    socket.on('log-out', (params, callback) => {
      this._logSocketInfo(socket, 'logout, disconnecting...')

      callback({})

      // Close the socket as we do not want a connection if it is not authorized. This will
      // automatically trigger the disconnect event that will remove the socket from sockets
      socket.disconnect()
    })
  }

  _onSubscribe (socket) {
    this._addSocketListener({
      socket: socket,
      eventName: 'subscribe',
      promiseFactory: async (socket, dbNames) => {
        this._logSocketInfo(socket, 'subscribe to dbName=' + JSON.stringify(dbNames))
        this._sockets.subscribe(socket, dbNames)
      }
    })
  }

  _onUnsubscribe (socket) {
    this._addSocketListener({
      socket: socket,
      eventName: 'unsubscribe',
      promiseFactory: async (socket, dbNames) => {
        this._logSocketInfo(socket, 'unsubscribe from dbName=' + JSON.stringify(dbNames))
        this._sockets.unsubscribe(socket, dbNames)
      }
    })
  }

  _onDisconnect (socket) {
    // The disconnect event is different than others so we don't use _addSocketListener
    socket.on('disconnect', () => {
      this._logSocketInfo(socket, 'disconnect')
      this._sockets.remove(socket)
    })
  }

  _toDBName (change) {
    return /:(.*)$/.exec(change.id)[1]
  }

  _listenToGlobalChanges () {
    this._iterator = this._slouch.db.changes('_global_changes', {
      feed: 'continuous',
      heartbeat: true,
      since: 'now'
    })

    this._iterator.each(async change => {
      let dbName = this._toDBName(change)

      let sockets = this._sockets.get(dbName)

      // Are there any subscribers to this DB?
      if (sockets) {
        sporks.each(sockets, socket => {
          socket.emit('change', dbName)
        })
      }
    })
  }

  start () {
    this._onConnection()

    log.info('Listening on port', this._port)
    this._io.listen(this._port)

    this._listenToGlobalChanges()
  }

  stop () {
    // Stop accepting connections
    this._io.close()

    // Close each socket connection
    this._sockets.close()

    if (this._iterator) {
      this._iterator.abort()
    }
  }
}

module.exports = Server
