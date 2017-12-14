'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _session = require('./session');

var _session2 = _interopRequireDefault(_session);

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

var _sporks = require('sporks');

var _sporks2 = _interopRequireDefault(_sporks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Client = function (_events$EventEmitter) {
  _inherits(Client, _events$EventEmitter);

  function Client(url) {
    _classCallCheck(this, Client);

    var _this = _possibleConstructorReturn(this, (Client.__proto__ || Object.getPrototypeOf(Client)).call(this));

    _this._url = url;
    _this._session = new _session2.default();

    // A list of the DB names for which we are already subscribed
    _this._subscribedToDBs = {};

    _this._connected = false;

    _this._connectIfCookie();
    return _this;
  }

  _createClass(Client, [{
    key: '_connectIfCookie',
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

                if (cookie) {
                  this._connectAndEmitIfError(null, null, cookie);
                }

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _connectIfCookie() {
        return _ref.apply(this, arguments);
      }

      return _connectIfCookie;
    }()
  }, {
    key: '_emitSubscribe',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(dbNames) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this._emit('subscribe', dbNames);

              case 2:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _emitSubscribe(_x) {
        return _ref2.apply(this, arguments);
      }

      return _emitSubscribe;
    }()
  }, {
    key: '_emitUnsubscribe',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(dbNames) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this._emit('unsubscribe', dbNames);

              case 2:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function _emitUnsubscribe(_x2) {
        return _ref3.apply(this, arguments);
      }

      return _emitUnsubscribe;
    }()
  }, {
    key: '_resubscribe',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(_sporks2.default.length(this._subscribedToDBs) > 0)) {
                  _context4.next = 3;
                  break;
                }

                _context4.next = 3;
                return this._emitSubscribe(Object.keys(this._subscribedToDBs));

              case 3:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function _resubscribe() {
        return _ref4.apply(this, arguments);
      }

      return _resubscribe;
    }()
  }, {
    key: '_emitError',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(err) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                this.emit('error', err);

              case 1:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function _emitError(_x3) {
        return _ref5.apply(this, arguments);
      }

      return _emitError;
    }()
  }, {
    key: '_onceResponse',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(eventName) {
        var response;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return _sporks2.default.once(this._socket, eventName);

              case 2:
                response = _context6.sent;

                if (!_utils2.default.isError(response[0])) {
                  _context6.next = 7;
                  break;
                }

                throw _utils2.default.toError(response[0]);

              case 7:
                return _context6.abrupt('return', response[0]);

              case 8:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function _onceResponse(_x4) {
        return _ref6.apply(this, arguments);
      }

      return _onceResponse;
    }()
  }, {
    key: '_waitForAuthenticationResponse',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        var authenticated, notAuthenticated, auth;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                authenticated = this._onceResponse('authenticated');
                notAuthenticated = this._onceResponse('not-authenticated');
                _context7.next = 4;
                return Promise.race([authenticated, notAuthenticated]);

              case 4:
                _context7.next = 6;
                return authenticated;

              case 6:
                auth = _context7.sent;
                return _context7.abrupt('return', auth);

              case 8:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function _waitForAuthenticationResponse() {
        return _ref7.apply(this, arguments);
      }

      return _waitForAuthenticationResponse;
    }()
  }, {
    key: '_onChange',
    value: function _onChange() {
      var _this2 = this;

      this._socket.on('change', function (dbName) {
        _this2.emit('change', dbName);
      });
    }
  }, {
    key: '_onDisconnect',
    value: function _onDisconnect() {
      var _this3 = this;

      this._socket.on('disconnect', function () {
        _this3.emit('disconnect');
        _this3._connected = false;
      });
    }
  }, {
    key: '_onConnect',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        var authenticated;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this._waitForAuthenticationResponse();

              case 2:
                authenticated = _context8.sent;
                _context8.next = 5;
                return this._resubscribe();

              case 5:

                this._onChange();
                this._onDisconnect();

                this.emit('connect');
                this._connected = true;

                return _context8.abrupt('return', authenticated);

              case 10:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function _onConnect() {
        return _ref8.apply(this, arguments);
      }

      return _onConnect;
    }()
  }, {
    key: '_toQueryString',
    value: function _toQueryString(username, password, cookie) {
      var params = {};

      if (username) {
        params.username = username;
      }

      if (password) {
        params.password = password;
      }

      if (cookie) {
        params.cookie = cookie;
      }

      return _utils2.default._toQueryString(params);
    }
  }, {
    key: '_connect',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(username, password, cookie) {
        var qs, r;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                qs = this._toQueryString(username, password, cookie);


                this._socket = (0, _socket2.default)(this._url + '?' + qs);

                _context9.next = 4;
                return _sporks2.default.once(this._socket, 'connect');

              case 4:
                _context9.next = 6;
                return this._onConnect();

              case 6:
                r = _context9.sent;
                return _context9.abrupt('return', r);

              case 8:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function _connect(_x5, _x6, _x7) {
        return _ref9.apply(this, arguments);
      }

      return _connect;
    }()
  }, {
    key: '_connectAndEmitIfError',
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(username, password, cookie) {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                try {
                  this._connect(username, password, cookie);
                } catch (err) {
                  this._emitError(err);
                }

              case 1:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function _connectAndEmitIfError(_x8, _x9, _x10) {
        return _ref10.apply(this, arguments);
      }

      return _connectAndEmitIfError;
    }()
  }, {
    key: '_throwIfError',
    value: function _throwIfError(obj, resolve, reject) {
      if (obj.error) {
        // TODO: use commonUtils.toError
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
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var ack = function ack(obj) {
          _this4._throwIfError(obj, resolve, reject);
        };
        _this4._socket.emit(eventName, args, ack);
      });
    }
  }, {
    key: 'logIn',
    value: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(username, password, cookie) {
        var r;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return this._connect(username, password, cookie);

              case 2:
                r = _context11.sent;
                _context11.next = 5;
                return this._session.set(r.cookie);

              case 5:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function logIn(_x11, _x12, _x13) {
        return _ref11.apply(this, arguments);
      }

      return logIn;
    }()
  }, {
    key: 'logOut',
    value: function () {
      var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return this._emit('log-out');

              case 2:
                _context12.next = 4;
                return this._session.clear();

              case 4:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function logOut() {
        return _ref12.apply(this, arguments);
      }

      return logOut;
    }()
  }, {
    key: 'subscribe',
    value: function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(dbName) {
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                if (!this._connected) {
                  _context13.next = 3;
                  break;
                }

                _context13.next = 3;
                return this._emit('subscribe', [dbName]);

              case 3:
                this._subscribedToDBs[dbName] = true;

              case 4:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function subscribe(_x14) {
        return _ref13.apply(this, arguments);
      }

      return subscribe;
    }()
  }, {
    key: 'unsubscribe',
    value: function () {
      var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(dbName) {
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                if (!this._connected) {
                  _context14.next = 3;
                  break;
                }

                _context14.next = 3;
                return this._emit('unsubscribe', [dbName]);

              case 3:
                delete this._subscribedToDBs[dbName];

              case 4:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function unsubscribe(_x15) {
        return _ref14.apply(this, arguments);
      }

      return unsubscribe;
    }()
  }, {
    key: 'stop',
    value: function stop() {
      if (this._socket) {
        this._socket.disconnect();
      }
    }
  }]);

  return Client;
}(_events2.default.EventEmitter);

module.exports = Client;