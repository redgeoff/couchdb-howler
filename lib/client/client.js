'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _session = require('./session');

var _session2 = _interopRequireDefault(_session);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// TODO: client.on('change', (dbName) => {})

var Client = function (_events$EventEmitter) {
  _inherits(Client, _events$EventEmitter);

  function Client(url) {
    _classCallCheck(this, Client);

    var _this = _possibleConstructorReturn(this, (Client.__proto__ || Object.getPrototypeOf(Client)).call(this));

    _this._url = url;
    _this._connect();
    _this._session = new _session2.default();
    return _this;
  }

  _createClass(Client, [{
    key: '_onConnect',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var cookie;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this._session.get();

              case 2:
                cookie = _context.sent;

                if (!cookie) {
                  _context.next = 6;
                  break;
                }

                _context.next = 6;
                return this._emit('log-in', { cookie: cookie });

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _onConnect() {
        return _ref.apply(this, arguments);
      }

      return _onConnect;
    }()
  }, {
    key: '_connect',
    value: function _connect() {
      var _this2 = this;

      this._socket = (0, _socket2.default)(this._url);

      this._socket.on('connect', function () {
        _this2._onConnect();
      });
    }
  }, {
    key: '_throwIfError',
    value: function _throwIfError(obj, resolve, reject) {
      if (obj.error) {
        var err = new Error(obj.errorMessage);
        err.name = obj.errorName;
        reject(err);
      } else {
        resolve(obj);
      }
    }
  }, {
    key: '_emit',
    value: function _emit(eventName, args) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var ack = function ack(obj) {
          _this3._throwIfError(obj, resolve, reject);
        };
        _this3._socket.emit(eventName, args, ack);
      });
    }
  }, {
    key: 'logIn',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(username, password, cookie) {
        var r;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this._emit('log-in', { username: username, password: password, cookie: cookie });

              case 2:
                r = _context2.sent;
                _context2.next = 5;
                return this._session.set(r.cookie);

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function logIn(_x, _x2, _x3) {
        return _ref2.apply(this, arguments);
      }

      return logIn;
    }()
  }, {
    key: 'logOut',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this._emit('log-out');

              case 2:
                _context3.next = 4;
                return this._session.clear();

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function logOut() {
        return _ref3.apply(this, arguments);
      }

      return logOut;
    }()
  }, {
    key: 'subscribe',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(dbName) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this._emit('subscribe', { dbName: dbName });

              case 2:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function subscribe(_x4) {
        return _ref4.apply(this, arguments);
      }

      return subscribe;
    }()
  }, {
    key: 'unsubscribe',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(dbName) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this._emit('unsubscribe', { dbName: dbName });

              case 2:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function unsubscribe(_x5) {
        return _ref5.apply(this, arguments);
      }

      return unsubscribe;
    }()
  }, {
    key: 'stop',
    value: function stop() {
      this._socket.disconnect();
    }
  }]);

  return Client;
}(_events2.default.EventEmitter);

module.exports = Client;