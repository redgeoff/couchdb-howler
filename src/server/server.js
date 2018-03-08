import socketIO from 'socket.io'
import log from './log'
import Sockets from './sockets'
import utils from './utils'
import Slouch from 'couch-slouch'
import commonUtils from '../utils'

class Server {
  constructor (opts) {
    this._port = opts.port
    this._io = socketIO()
    this._sockets = new Sockets()
    this._slouch = new Slouch(opts['couchdb_url'])
    log.level(utils.getOpt(opts, 'log_level', 'info'))
    this._iterator = null
    this._started = false
  }

  async _logInOrVerifyLogin (socket, params) {
    let response = null

    if (params.cookie) {
      // A cookie was supplied so verify that it is valid
      await this._slouch.user.authenticated(params.cookie)
      response = {
        cookie: params.cookie
      }
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
    this._listenForLogOut(socket)
    this._listenForSubscribe(socket)
    this._listenForUnsubscribe(socket)
    this._listenForDisconnect(socket)
    this._listenForHeartbeat(socket)
  }

  async _authenticate (socket) {
    try {
      let params = socket.handshake.query

      this._sockets.log(socket, 'authentication attempt')

      let response = await this._logInOrVerifyLogin(socket, params)

      this._sockets.log(socket, 'authentication success')
      socket.emit('authenticated', { cookie: response.cookie })

      this._onAuthenticated(socket)
    } catch (err) {
      this._sockets.log(socket, 'authentication failure=' + JSON.stringify(err))
      socket.emit('not-authenticated', commonUtils.errorToResponse(err))
      this._disconnect(socket)
    }
  }

  _listenForConnection () {
    // We handle the authentication during the connection so that it is slightly harder for a DDOS
    // attack to exhaust our connection pool
    this._io.on('connection', async socket => {
      this._sockets.log(socket, 'connection')
      await this._authenticate(socket)
    })
  }

  _addSocketListener (opts) {
    opts.socket.on(opts.eventName, async (params, callback) => {
      await utils.respond(callback, async () => {
        return opts.promiseFactory(opts.socket, params)
      })
    })
  }

  _disconnect (socket) {
    // Close the socket as we do not want a connection if it is not authorized. This will
    // automatically trigger the disconnect event that will remove the socket from sockets
    socket.disconnect()
  }

  _listenForLogOut (socket) {
    // We cannot use _addSocketListener as we need to respond before issuing the disconnect
    socket.on('log-out', (params, callback) => {
      this._sockets.log(socket, 'logout, disconnecting...')

      let obj = {}
      callback(obj)

      this._disconnect(socket)
    })
  }

  _listenForSubscribe (socket) {
    this._addSocketListener({
      socket: socket,
      eventName: 'subscribe',
      promiseFactory: async (socket, dbNames) => {
        this._sockets.log(socket, 'subscribe to dbName=' + JSON.stringify(dbNames))
        this._sockets.subscribe(socket, dbNames)
      }
    })
  }

  _listenForUnsubscribe (socket) {
    this._addSocketListener({
      socket: socket,
      eventName: 'unsubscribe',
      promiseFactory: async (socket, dbNames) => {
        this._sockets.log(socket, 'unsubscribe from dbName=' + JSON.stringify(dbNames))
        this._sockets.unsubscribe(socket, dbNames)
      }
    })
  }

  _listenForDisconnect (socket) {
    // The disconnect event is different than others so we don't use _addSocketListener
    socket.on('disconnect', () => {
      this._sockets.log(socket, 'disconnect')
      this._sockets.remove(socket)
    })
  }

  _listenForHeartbeat (socket) {
    this._addSocketListener({
      socket: socket,
      eventName: 'heartbeat',
      promiseFactory: async socket => {
        this._sockets.log(socket, 'heartbeat')
        return { ok: true }
      }
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
      this._sockets.emitChangeForDBName(dbName)
    })
  }

  start () {
    this._listenForConnection()

    log.info('Listening on port', this._port)
    this._io.listen(this._port)

    this._listenToGlobalChanges()

    this._started = true
  }

  stop () {
    if (this._started) {
      // Stop accepting connections
      this._io.close()

      // Close each socket connection
      this._sockets.close()

      this._iterator.abort()
    }

    this._started = false
  }
}

module.exports = Server
