import config from './config'
import Slouch from 'couch-slouch'

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

  // TODO: move to sporks
  shouldEqual (var1, var2) {
    // prettier appears to find fault with notation like `(myVar === undefined).should.eql(true)` so
    // this helper function will keep things clean
    let eq = var1 === var2
    eq.should.eql(true)
  }

  // TODO: move to sporks
  shouldNotEqual (var1, var2) {
    // prettier appears to find fault with notation like `(myVar === undefined).should.eql(false)`
    // so this helper function will keep things clean
    let eq = var1 !== var2
    eq.should.eql(true)
  }
}

module.exports = new Utils()
