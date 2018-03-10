'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cookie = require('./cookie');

var _cookie2 = _interopRequireDefault(_cookie);

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Session = function () {
  function Session() {
    _classCallCheck(this, Session);

    this._name = 'couchdb-howler-session';
    this._cookie = _cookie2.default.getProvider(_utils2.default.inBrowser());
  }

  // We use the async keyword to allow for swapping out the session store with an async store


  _createClass(Session, [{
    key: 'set',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // We must set an expiration if we want the cookie to persist across app restarts. As per
                // https://stackoverflow.com/a/8713316/2831606 on iOS, cookies without an expiration are
                // considered session cookies and cleared when the app is restarted. The cookies will expire
                // after 30 days. TODO: make this value configurable via Client.
                this._cookie.set(this._name, id, { expires: 30 });

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function set(_x) {
        return _ref.apply(this, arguments);
      }

      return set;
    }()

    // We use the async keyword to allow for swapping out the session store with an async store

  }, {
    key: 'get',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', this._cookie.get(this._name));

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function get() {
        return _ref2.apply(this, arguments);
      }

      return get;
    }()

    // We use the async keyword to allow for swapping out the session store with an async store

  }, {
    key: 'clear',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this._cookie.remove(this._name);

              case 2:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function clear() {
        return _ref3.apply(this, arguments);
      }

      return clear;
    }()
  }]);

  return Session;
}();

module.exports = Session;