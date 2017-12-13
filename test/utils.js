import config from './config.json'
import Slouch from 'couch-slouch'

class Utils {
  constructor () {
    this.slouch = new Slouch(this.getCouchDBURL())
    this.username = 'test_username'
    this.password = 'secret'
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
