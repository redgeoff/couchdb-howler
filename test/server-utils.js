import config from './config'
import Server from '../src/server/server'
import testUtils from './utils'
import spawner from './spawner'
import path from 'path'

class Utils {
  async createTestServer1 () {
    this._server1 = new Server({
      port: config.server1.port,
      'couchdb-url': testUtils.getCouchDBURL()
    })
    await this._server1.start()
  }

  async destroyTestServer1 () {
    await this._server1.stop()
  }

  async createTestServer2 () {
    this._server2 = spawner.run(path.join(__dirname, '../bin/server.js'), [
      '--port',
      config.server2.port,
      '--couchdb-url',
      testUtils.getCouchDBURL()
    ])
  }

  async destroyTestServer2 () {
    await spawner.kill(this._server2)
  }

  async createTestServers () {
    await this.createTestServer1()
    await this.createTestServer2()
  }

  async destroyTestServers () {
    await this.destroyTestServer1()
    await this.destroyTestServer2()
  }
}

module.exports = new Utils()
