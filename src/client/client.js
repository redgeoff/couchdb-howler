import events from 'events'
import io from 'socket.io-client'

// TODO: client.on('change', (dbName) => {})

class Client extends events.EventEmitter {
  constructor (url) {
    super()
    this._url = url
    this._connect()
  }

  _connect () {
    // console.log(this._url)
    this._socket = io(this._url)

    // // TMP
    // this._socket.on('connect', () => {
    //   console.log('client connected')
    // })
  }

  _emit (eventName, args) {
    return new Promise(resolve => {
      this._socket.emit(eventName, args, resolve)
    })
  }

  async subscribe (dbName) {
    await this._emit('subscribe', dbName)
  }

  async unsubscribe (dbName) {
    await this._emit('unsubscribe', dbName)
  }

  stop () {
    this._socket.disconnect()
  }
}

module.exports = Client
