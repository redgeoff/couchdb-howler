class NodeCookie {
  constructor () {
    this._cookies = {}
  }

  // We use the async keyword to allow for swapping out the session store with an async store
  async set (name, id) {
    this._cookies[name] = id
  }

  // We use the async keyword to allow for swapping out the session store with an async store
  async get (name) {
    return this._cookies[name]
  }

  // We use the async keyword to allow for swapping out the session store with an async store
  async remove (name) {
    delete this._cookies[name]
  }
}

module.exports = new NodeCookie()
