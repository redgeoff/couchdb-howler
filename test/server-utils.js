import config from './config'
import Server from '../src/server/server'
import testUtils from './utils'
import spawner from './spawner'
import path from 'path'
import log from '../src/server/log'

class Utils {
  async createTestServer1 () {
    this._server1 = new Server({
      port: config.server1.port,
      'couchdb_url': testUtils.getCouchDBURL(),
      'log_level': 'warn'
    })
    await this._server1.start()
  }

  async destroyTestServer1 () {
    await this._server1.stop()
  }

  rootPath () {
    if (/cache/.test(__dirname)) {
      // The path is relative to cache/compiled/test
      return path.join(__dirname, '/../../..')
    } else {
      return path.join(__dirname, '/..')
    }
  }

  async createTestServer2 () {
    this._server2 = spawner.run(path.join(this.rootPath(), 'bin/server.js'), [
      '--port',
      config.server2.port,
      '--couchdb_url',
      testUtils.getCouchDBURL(),
      '--log_level',
      'warn'
    ])
  }

  async destroyTestServer2 () {
    await spawner.kill(this._server2)
  }

  async createTestServer3 () {
    this._server3 = new Server({
      port: config.server3.port,
      'couchdb_url': testUtils.getCouchDBURL()
    })
  }

  async destroyTestServer3 () {
    await this._server3.stop()
  }

  async createTestServers () {
    await this.createTestServer1()
    await this.createTestServer2()
  }

  async destroyTestServers () {
    await this.destroyTestServer1()
    await this.destroyTestServer2()
  }

  silenceLog () {
    let funs = ['fatal', 'error', 'warn', 'info', 'debug', 'trace']
    funs.forEach(fun => {
      log[fun] = () => {}
    })
  }
}

module.exports = new Utils()
