import events from 'events'
import io from 'socket.io-client'
import Session from './session'
import commonUtils from '../utils'
import sporks from 'sporks'

class Client extends events.EventEmitter {
  constructor (url, session) {
    super()
    this._url = url
    this._session = session || new Session()

    // A list of the DB names for which we are already subscribed
    this._subscribedToDBs = {}

    this._connected = false
    this._ready = false

    this._connectIfCookie()
  }

  async _connectIfCookie () {
    // Already logged in? Use the cookie to authenticate
    let cookie = await this._session.get()
    if (cookie) {
      this._connectAndEmitIfError(null, null, cookie)
    }
  }

  async _emitSubscribe (dbNames) {
    await this._emit('subscribe', dbNames)
  }

  async _emitUnsubscribe (dbNames) {
    await this._emit('unsubscribe', dbNames)
  }

  async _resubscribe () {
    if (sporks.length(this._subscribedToDBs) > 0) {
      await this._emitSubscribe(Object.keys(this._subscribedToDBs))
    }
  }

  async _emitError (err) {
    this.emit('error', err)
  }

  async _onceResponse (eventName) {
    let response = await sporks.once(this._socket, eventName)
    if (commonUtils.isError(response[0])) {
      throw commonUtils.responseToError(response[0])
    } else {
      return response[0]
    }
  }

  async _waitForAuthenticationResponse () {
    let authenticated = this._onceResponse('authenticated')
    let notAuthenticated = this._onceResponse('not-authenticated')
    await Promise.race([authenticated, notAuthenticated])
    let auth = await authenticated
    return auth
  }

  _listenForChange () {
    this._socket.on('change', dbName => {
      this.emit('change', dbName)
    })
  }

  _listenForDisconnect () {
    this._socket.on('disconnect', () => {
      this.emit('disconnect')
      this._connected = false
      this._ready = false
    })
  }

  async _onConnect () {
    this._connected = true
    this.emit('connect')

    // We just connected so resubscribe
    await this._resubscribe()

    this._ready = true
    this.emit('ready')

    // We listen after ready as we don't want to double report errors as logIn() will already throw
    // an error
    this._listenForNotAuthenticated()
  }

  async _authenticate () {
    let authenticated = await this._waitForAuthenticationResponse()

    await this._onConnect()

    return authenticated
  }

  _toQueryString (username, password, cookie) {
    let params = {}

    if (username) {
      params.username = username
    }

    if (password) {
      params.password = password
    }

    if (cookie) {
      params.cookie = cookie
    }

    return commonUtils._toQueryString(params)
  }

  _onAuthenticatedFactory () {
    return () => {
      this._onConnect()
    }
  }

  async _listenForAuthenticated () {
    // An 'authenticated' event can be fired when the server goes down and then comes back. We need
    // to listen for the 'authenticated' event and not the 'connected' event because the
    // 'authenticated' event is fired when the server is ready for requests
    this._socket.on('authenticated', this._onAuthenticatedFactory())
  }

  _onNotAuthenticatedFactory () {
    return response => {
      this._emitError(commonUtils.responseToError(response))
    }
  }

  async _listenForNotAuthenticated () {
    // A 'not-authenticated' event can be fired when the server goes down, comes back and the
    // session has expired
    this._socket.on('not-authenticated', this._onNotAuthenticatedFactory())
  }

  async _connect (username, password, cookie) {
    let qs = this._toQueryString(username, password, cookie)

    this._socket = io(this._url + '?' + qs)

    await sporks.once(this._socket, 'connect')

    this._listenForChange()
    this._listenForDisconnect()

    let r = await this._authenticate()

    // We listen for the authenticated event after we have authenticated as we only want to listen
    // for authentications that occur when there is a reconnect
    this._listenForAuthenticated()

    return r
  }

  async _connectAndEmitIfError (username, password, cookie) {
    try {
      await this._connect(username, password, cookie)
    } catch (err) {
      this._emitError(err)
    }
  }

  _throwIfError (response, resolve, reject) {
    if (commonUtils.isError(response)) {
      reject(commonUtils.responseToError(response))
    } else {
      resolve(response)
    }
  }

  _emit (eventName, args) {
    return new Promise((resolve, reject) => {
      const ack = response => {
        this._throwIfError(response, resolve, reject)
      }
      if (!this.isConnected()) {
        reject(new Error('not connected'))
      } else {
        this._socket.emit(eventName, args, ack)
      }
    })
  }

  async logIn (username, password, cookie) {
    let r = await this._connect(username, password, cookie)
    await this._session.set(r.cookie)
    return r
  }

  async _emitLogOut () {
    await this._emit('log-out')
  }

  async logOut () {
    // We clear the session first as we want the session cleared even if the log out fails
    await this._session.clear()
    await this._emitLogOut()
  }

  async subscribe (dbName) {
    if (this.isConnected()) {
      await this._emitSubscribe([dbName])
    }
    this._subscribedToDBs[dbName] = true
  }

  async unsubscribe (dbName) {
    if (this.isConnected()) {
      await this._emitUnsubscribe([dbName])
    }
    delete this._subscribedToDBs[dbName]
  }

  stop () {
    if (this._socket) {
      this._socket.disconnect()
    }
  }

  isConnected () {
    return this._connected
  }
}

module.exports = Client
