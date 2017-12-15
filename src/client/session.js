import cookie from 'js-cookie'

class Session {
  constructor () {
    this._name = 'couchdb-howler-session'
  }

  // We use the async keyword to allow for swapping out the session store with an async store
  async set (id) {
    cookie.set(this._name, id)
  }

  // We use the async keyword to allow for swapping out the session store with an async store
  async get () {
    return cookie.get(this._name)
  }

  // We use the async keyword to allow for swapping out the session store with an async store
  async clear () {
    await cookie.remove(this._name)
  }
}

module.exports = Session
