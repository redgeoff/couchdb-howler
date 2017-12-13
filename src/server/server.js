import io from 'socket.io'
import utils from './utils'

class Server {
  constructor (opts) {
    this._port = utils.getOpt(opts, 'port', 3000)
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
