import socketIO from 'socket.io'
import log from './log'
import Sockets from './sockets'
import utils from './utils'
import Slouch from 'couch-slouch'

class Server {
  constructor (opts) {
    this._port = opts.port
    this._io = socketIO()
    this._sockets = new Sockets()
    this._slouch = new Slouch(opts['couchdb-url'])
  }

  _onConnection () {
    this._io.on('connection', socket => {
      this._logSocketInfo(socket, 'connection')

      this._sockets.add(socket)

      this._onLogIn(socket)
      this._onLogOut(socket)
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

  _addSocketListener (opts) {
    opts.socket.on(opts.eventName, async (params, callback) => {
      await utils.respond(callback, async () => {
        if (opts.requireAuthentication) {
          this._sockets.throwIfNotAuthenticated(opts.socket)
        }
        await opts.promiseFactory(opts.socket, params)
      })
    })
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

    // Associate cookie with socket
    this._sockets.setCookie(socket, response.cookie)

    return response
  }

  _onLogIn (socket) {
    this._addSocketListener({
      socket: socket,
      eventName: 'log-in',
      promiseFactory: async (socket, params) => {
        this._logSocketInfo(
          socket,
          'log-in for ' + (params.cookie ? params.cookie : params.username)
        )
        await this._logInOrVerifyLogin(socket, params)
      }
    })
  }

  _onLogOut (socket) {
    this._addSocketListener({
      socket: socket,
      eventName: 'log-out',
      promiseFactory: async (socket, params) => {
        this._logSocketInfo(socket, 'log-out for ' + this._sockets.getCookie(socket))
        this._sockets.clearCookie(socket)
      }
    })
  }

  _onSubscribe (socket) {
    this._addSocketListener({
      socket: socket,
      eventName: 'subscribe',
      requireAuthentication: true,
      promiseFactory: async (socket, params) => {
        this._logSocketInfo(socket, 'subscribe to dbName=' + params.dbName)
        this._sockets.subscribe(socket, params.dbName)
      }
    })
  }

  _onUnsubscribe (socket) {
    this._addSocketListener({
      socket: socket,
      eventName: 'unsubscribe',
      requireAuthentication: true,
      promiseFactory: async (socket, params) => {
        this._logSocketInfo(socket, 'unsubscribe from dbName=' + params.dbName)
        this._sockets.unsubscribe(socket, params.dbName)
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

  start () {
    this._onConnection()

    log.info('Listening on port', this._port)
    this._io.listen(this._port)
  }

  stop () {
    // Stop accepting connections
    this._io.close()

    // Close each socket connection
    this._sockets.close()
  }
}

module.exports = Server
