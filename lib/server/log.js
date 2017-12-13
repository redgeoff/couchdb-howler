'use strict';

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = _bunyan2.default.createLogger({ name: 'couchdb-howler', src: true });

var origFatal = log.fatal;

/* istanbul ignore next */
log.fatal = function () {
  origFatal.apply(this, arguments);

  // Exit as this is a fatal error
  process.exit(-1);
};

module.exports = log;