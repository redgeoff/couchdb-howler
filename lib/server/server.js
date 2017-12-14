'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

var _sockets = require('./sockets');

var _sockets2 = _interopRequireDefault(_sockets);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _couchSlouch = require('couch-slouch');

var _couchSlouch2 = _interopRequireDefault(_couchSlouch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Server = function () {
  function Server(opts) {
    _classCallCheck(this, Server);

    this._port = opts.port;
    this._io = (0, _socket2.default)();
    this._sockets = new _sockets2.default();
    this._slouch = new _couchSlouch2.default(opts['couchdb-url']);
  }

  _createClass(Server, [{
    key: '_logInOrVerifyLogin',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(socket, params) {
        var response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                response = null;

                if (!params.cookie) {
                  _context.next = 7;
                  break;
                }

                _context.next = 4;
                return this._slouch.user.authenticated(params.cookie);

              case 4:
                response = _context.sent;
                _context.next = 10;
                break;

              case 7:
                _context.next = 9;
                return this._slouch.user.authenticate(params.username, params.password);

              case 9:
                response = _context.sent;

              case 10:

                this._sockets.add(socket);

                // Associate cookie with socket
                this._sockets.setCookie(socket, response.cookie);

                return _context.abrupt('return', response);

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _logInOrVerifyLogin(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return _logInOrVerifyLogin;
    }()
  }, {
    key: '_onAuthenticated',
    value: function _onAuthenticated(socket) {
      this._onLogOut(socket);
      this._onSubscribe(socket);
      this._onUnsubscribe(socket);
      this._onDisconnect(socket);
    }
  }, {
    key: '_authenticate',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(socket) {
        var params, name, response;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                params = socket.handshake.query;
                name = params.cookie ? params.cookie : params.username;


                this._logSocketInfo(socket, 'authentication attempt for ' + name);

                _context2.next = 6;
                return this._logInOrVerifyLogin(socket, params);

              case 6:
                response = _context2.sent;


                this._logSocketInfo(socket, 'authentication success for ' + name);
                console.log('response=', response);
                socket.emit('authenticated', { cookie: response.cookie });

                this._onAuthenticated(socket);
                _context2.next = 17;
                break;

              case 13:
                _context2.prev = 13;
                _context2.t0 = _context2['catch'](0);

                this._logSocketInfo(socket, 'authentication failure for ' + name + ', err=' + JSON.stringify(_context2.t0));
                socket.emit('not-authenticated', _context2.t0);

              case 17:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 13]]);
      }));

      function _authenticate(_x3) {
        return _ref2.apply(this, arguments);
      }

      return _authenticate;
    }()
  }, {
    key: '_onConnection',
    value: function _onConnection() {
      var _this = this;

      this._io.on('connection', function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(socket) {
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _this._logSocketInfo(socket, 'connection');
                  _context3.next = 3;
                  return _this._authenticate(socket);

                case 3:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, _this);
        }));

        return function (_x4) {
          return _ref3.apply(this, arguments);
        };
      }());
    }
  }, {
    key: '_logSocketInfo',
    value: function _logSocketInfo(socket, msg) {
      _log2.default.info({
        socketId: socket.id,
        remoteAddress: socket.conn.remoteAddress
      }, msg);
    }
  }, {
    key: '_addSocketListener',
    value: function _addSocketListener(opts) {
      var _this2 = this;

      opts.socket.on(opts.eventName, function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(params, callback) {
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return _utils2.default.respond(callback, _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            _context4.next = 2;
                            return opts.promiseFactory(opts.socket, params);

                          case 2:
                          case 'end':
                            return _context4.stop();
                        }
                      }
                    }, _callee4, _this2);
                  })));

                case 2:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, _this2);
        }));

        return function (_x5, _x6) {
          return _ref4.apply(this, arguments);
        };
      }());
    }
  }, {
    key: '_onLogOut',
    value: function _onLogOut(socket) {
      var _this3 = this;

      this._addSocketListener({
        socket: socket,
        eventName: 'log-out',
        promiseFactory: function () {
          var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(socket, params) {
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _this3._logSocketInfo(socket, 'log-out for ' + _this3._sockets.getCookie(socket));

                    // Close the socket as we do not want a connection if it is not authorized. This will
                    // automatically trigger the disconnect event that will remove the socket from sockets
                    socket.destroy();

                  case 2:
                  case 'end':
                    return _context6.stop();
                }
              }
            }, _callee6, _this3);
          }));

          function promiseFactory(_x7, _x8) {
            return _ref6.apply(this, arguments);
          }

          return promiseFactory;
        }()
      });
    }
  }, {
    key: '_onSubscribe',
    value: function _onSubscribe(socket) {
      var _this4 = this;

      this._addSocketListener({
        socket: socket,
        eventName: 'subscribe',
        promiseFactory: function () {
          var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(socket, dbNames) {
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _this4._logSocketInfo(socket, 'subscribe to dbName=' + JSON.stringify(dbNames));
                    _this4._sockets.subscribe(socket, dbNames);

                  case 2:
                  case 'end':
                    return _context7.stop();
                }
              }
            }, _callee7, _this4);
          }));

          function promiseFactory(_x9, _x10) {
            return _ref7.apply(this, arguments);
          }

          return promiseFactory;
        }()
      });
    }
  }, {
    key: '_onUnsubscribe',
    value: function _onUnsubscribe(socket) {
      var _this5 = this;

      this._addSocketListener({
        socket: socket,
        eventName: 'unsubscribe',
        promiseFactory: function () {
          var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(socket, dbNames) {
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _this5._logSocketInfo(socket, 'unsubscribe from dbName=' + JSON.stringify(dbNames));
                    _this5._sockets.unsubscribe(socket, dbNames);

                  case 2:
                  case 'end':
                    return _context8.stop();
                }
              }
            }, _callee8, _this5);
          }));

          function promiseFactory(_x11, _x12) {
            return _ref8.apply(this, arguments);
          }

          return promiseFactory;
        }()
      });
    }
  }, {
    key: '_onDisconnect',
    value: function _onDisconnect(socket) {
      var _this6 = this;

      // The disconnect event is different than others so we don't use _addSocketListener
      socket.on('disconnect', function () {
        _this6._logSocketInfo(socket, 'disconnect');
        _this6._sockets.remove(socket);
      });
    }
  }, {
    key: 'start',
    value: function start() {
      this._onConnection();

      _log2.default.info('Listening on port', this._port);
      this._io.listen(this._port);
    }
  }, {
    key: 'stop',
    value: function stop() {
      // Stop accepting connections
      this._io.close();

      // Close each socket connection. TODO: need to manage this._sockets
      this._sockets.close();
    }
  }]);

  return Server;
}();

module.exports = Server;