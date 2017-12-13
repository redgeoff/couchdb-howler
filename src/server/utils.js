class Utils {
  getOpt (opts, name, def) {
    return opts && opts[name] !== undefined ? opts[name] : def
  }
}

module.exports = new Utils()
