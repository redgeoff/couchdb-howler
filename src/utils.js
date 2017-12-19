class Utils {
  isError (response) {
    return !!response.error
  }

  responseToError (response) {
    let err = new Error(response.errorMessage)
    err.name = response.errorName
    return err
  }

  errorToResponse (err) {
    return {
      error: true,
      errorName: err.name,
      errorMessage: err.message
    }
  }

  // TODO: move to sporks
  _toQueryString (params) {
    // Source: https://stackoverflow.com/a/34209399/2831606
    return Object.keys(params)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&')
  }

  // TODO: move to sporks
  inBrowser () {
    return !!global.window
  }
}

module.exports = new Utils()
