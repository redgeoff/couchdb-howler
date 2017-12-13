'use strict'

import bunyan from 'bunyan'
let log = bunyan.createLogger({ name: 'couchdb-howler', src: true })

let origFatal = log.fatal

/* istanbul ignore next */
log.fatal = function () {
  origFatal.apply(this, arguments)

  // Exit as this is a fatal error
  process.exit(-1)
}

module.exports = log
