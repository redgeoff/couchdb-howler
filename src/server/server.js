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
      var name = params.cookie ? params.cookie : params.username

      this._logSocketInfo(socket, 'authentication attempt for ' + name)

      let response = await this._logInOrVerifyLogin(socket, params)

      this._logSocketInfo(socket, 'authentication success for ' + name)
      console.log('response=', response)
      socket.emit('authenticated', { cookie: response.cookie })

      this._onAuthenticated(socket)
    } catch (err) {
      this._logSocketInfo(
        socket,
        'authentication failure for ' + name + ', err=' + JSON.stringify(err)
      )
      socket.emit('not-authenticated', err)
    }
  }

  _onConnection () {
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
    this._addSocketListener({
      socket: socket,
      eventName: 'log-out',
      promiseFactory: async (socket, params) => {
        this._logSocketInfo(socket, 'log-out for ' + this._sockets.getCookie(socket))

        // Close the socket as we do not want a connection if it is not authorized. This will
        // automatically trigger the disconnect event that will remove the socket from sockets
        socket.destroy()
      }
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

  start () {
    this._onConnection()

    log.info('Listening on port', this._port)
    this._io.listen(this._port)
  }

  stop () {
    // Stop accepting connections
    this._io.close()

    // Close each socket connection. TODO: need to manage this._sockets
    this._sockets.close()
  }
}

module.exports = Server
