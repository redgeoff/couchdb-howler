'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Session = function () {
  function Session() {
    _classCallCheck(this, Session);

    this._name = 'couchdb-howler-session';
  }

  _createClass(Session, [{
    key: 'put',
    value: function put(id) {
      _jsCookie2.default.set(this._name, id);
    }
  }, {
    key: 'get',
    value: function get() {
      return _jsCookie2.default.get(this._name);
    }
  }]);

  return Session;
}();

module.exports = new Session();