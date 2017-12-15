import config from './config'
import Server from '../src/server/server'
import testUtils from './utils'

class Utils {
  async createTestServer () {
    this._server = new Server({
      port: config.server.port,
      'couchdb-url': testUtils.getCouchDBURL()
    })
    await this._server.start()
  }

  async destroyTestServer () {
    await this._server.stop()
  }
}

module.exports = new Utils()
