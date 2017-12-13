import io from 'socket.io'

class Server {
  constructor (opts) {
    this._port = opts.port
  }

  start () {
    io.on('connection', client => {})
    io.listen(this._port)
  }

  stop () {
    io.close()
  }
}

module.exports = Server
