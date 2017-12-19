import cookie from './cookie'
import commonUtils from '../utils'

class Session {
  constructor () {
    this._name = 'couchdb-howler-session'
    this._cookie = cookie.getProvider(commonUtils.inBrowser())
  }

  // We use the async keyword to allow for swapping out the session store with an async store
  async set (id) {
    this._cookie.set(this._name, id)
  }

  // We use the async keyword to allow for swapping out the session store with an async store
  async get () {
    return this._cookie.get(this._name)
  }

  // We use the async keyword to allow for swapping out the session store with an async store
  async clear () {
    await this._cookie.remove(this._name)
  }
}

module.exports = Session
