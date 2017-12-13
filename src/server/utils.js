class Utils {
  respond (callback, obj) {}

  success (callback, obj) {
    callback(obj)
  }

  failure (callback, err) {
    callback({
      error: true,
      errorName: err.name,
      errorMessage: err.message
    })
  }
}

module.exports = new Utils()
