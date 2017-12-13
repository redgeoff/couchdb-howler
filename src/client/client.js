import events from 'events'
import io from 'socket.io-client'
import Session from './session'

// TODO: client.on('change', (dbName) => {})

class Client extends events.EventEmitter {
  constructor (url) {
    super()
    this._url = url
    this._connect()
    this._session = new Session()
  }

  async _onConnect () {
    let cookie = await this._session.get()

    // Already logged in? Use the cookie to authenticate
    if (cookie) {
      await this._emit('log-in', { cookie })
    }
  }

  _connect () {
    this._socket = io(this._url)

    this._socket.on('connect', () => {
      this._onConnect()
    })
  }

  _throwIfError (obj, resolve, reject) {
    if (obj.error) {
      let err = new Error(obj.errorMessage)
      err.name = obj.errorName
      reject(err)
    } else {
      resolve(obj)
    }
  }

  _emit (eventName, args) {
    return new Promise((resolve, reject) => {
      const ack = obj => {
        this._throwIfError(obj, resolve, reject)
      }
      this._socket.emit(eventName, args, ack)
    })
  }

  async logIn (username, password, cookie) {
    let r = await this._emit('log-in', { username, password, cookie })
    await this._session.set(r.cookie)
  }

  async logOut () {
    await this._emit('log-out')
    await this._session.clear()
  }

  async subscribe (dbName) {
    await this._emit('subscribe', { dbName })
  }

  async unsubscribe (dbName) {
    await this._emit('unsubscribe', { dbName })
  }

  stop () {
    this._socket.disconnect()
  }
}

module.exports = Client
