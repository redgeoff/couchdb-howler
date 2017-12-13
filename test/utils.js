import config from './config.json'
import Slouch from 'couch-slouch'
import Server from '../src/server/server'

class Utils {
  constructor () {
    this.slouch = new Slouch(this.getCouchDBURL())
    this.username = 'test_username'
    this.password = 'secret'
  }

  getServerURL () {
    return config.server.scheme + '://' + config.server.host + ':' + config.server.port
  }

  getCouchDBURL () {
    return (
      config.couchdb.scheme +
      '://' +
      config.couchdb.username +
      ':' +
      config.couchdb.password +
      '@' +
      config.couchdb.host +
      ':' +
      config.couchdb.port
    )
  }

  async createTestServer () {
    this._server = new Server({ port: config.server.port, 'couchdb-url': this.getCouchDBURL() })
    await this._server.start()
  }

  async destroyTestServer () {
    await this._server.stop()
  }

  async createTestUser () {
    await this.slouch.user.create(this.username, this.password)
  }

  async destroyTestUser () {
    await this.slouch.user.destroy(this.username)
  }

  async shouldThrow (promiseFactory, errName) {
    let err = null

    try {
      await promiseFactory()
    } catch (_err) {
      err = _err
    }

    err.name.should.eql(errName)
  }
}

module.exports = new Utils()
