import commonUtils from '../utils'

class Utils {
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
      let r = promiseFactory ? await promiseFactory() : {}
      this._success(callback, r)
    } catch (err) {
      this._failure(callback, err)
    }
  }
}

module.exports = new Utils()
