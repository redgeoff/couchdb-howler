'use strict';

require('babel-polyfill');

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// We import babel-polyfill here so that external projects don't have to depend on the polyfill
// directly. This way, the babel-polyfill dependency stays at the howler layer.
module.exports = _server2.default;