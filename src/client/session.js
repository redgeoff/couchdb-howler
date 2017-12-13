import cookie from 'js-cookie';

class Session {
  constructor() {
    this._name = 'couchdb-howler-session';
  }

  put(id) {
    cookie.set(this._name, id);
  }

  get() {
    return cookie.get(this._name);
  }
}

module.exports = new Session();
