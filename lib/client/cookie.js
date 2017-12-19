'use strict';

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

var _nodeCookie = require('./node-cookie');

var _nodeCookie2 = _interopRequireDefault(_nodeCookie);

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// js-cookie doesn't actually store anything in node so we create an abstraction so that cookies
// will work in node. This is needed so that if we use the client in node, it can reconnect to the
// server with the cookie and not a username and password

module.exports = _utils2.default.inBrowser() ? _jsCookie2.default : _nodeCookie2.default;