import commonUtils from '../utils'

class Utils {
  getOpt (opts, name, def) {
    return opts && opts[name] !== undefined ? opts[name] : def
  }

  _success (callback, obj) {
    callback(obj || {})
  }

  _failure (callback, err) {
    // For some reason the linter requires obj to be defined before it is used with callback()
    let obj = commonUtils.errorToResponse(err)
    callback(obj)
  }

  async respond (callback, promiseFactory) {
    try {
      let r = await promiseFactory()
      this._success(callback, r)
    } catch (err) {
      this._failure(callback, err)
    }
  }
}

module.exports = new Utils()
