'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

var _nodeCookie = require('./node-cookie');

var _nodeCookie2 = _interopRequireDefault(_nodeCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// js-cookie doesn't actually store anything in node so we create an abstraction so that cookies
// will work in node. This is needed so that if we use the client in node, it can reconnect to the
// server with the cookie and not a username and password
var Cookie = function () {
  function Cookie() {
    _classCallCheck(this, Cookie);
  }

  _createClass(Cookie, [{
    key: 'getProvider',
    value: function getProvider(inBrowser) {
      return inBrowser ? _jsCookie2.default : _nodeCookie2.default;
    }
  }]);

  return Cookie;
}();

module.exports = new Cookie();