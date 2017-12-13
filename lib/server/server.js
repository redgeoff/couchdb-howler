'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Server = function () {
  function Server(opts) {
    _classCallCheck(this, Server);

    this._port = opts.port;
    this._io = (0, _socket2.default)();
    this._sockets = [];
  }

  _createClass(Server, [{
    key: '_onConnection',
    value: function _onConnection() {
      var _this = this;

      this._io.on('connection', function (socket) {
        _this._sockets.push(socket);
        _this._onSubscribe(socket);
        _this._onUnsubscribe(socket);
        _this._onDisconnect(socket);
      });
    }
  }, {
    key: '_onSubscribe',
    value: function _onSubscribe(socket) {
      socket.on('subscribe', function (dbName, callback) {
        // TODO
        _log2.default.info('dbName=%s', dbName);

        // Ack
        callback(dbName);
      });
    }
  }, {
    key: '_onUnsubscribe',
    value: function _onUnsubscribe(socket) {
      socket.on('unsubscribe', function (dbName, callback) {
        // TODO
        _log2.default.info('dbName=%s', dbName);

        // Ack
        callback(dbName);
      });
    }
  }, {
    key: '_onDisconnect',
    value: function _onDisconnect(socket) {
      var _this2 = this;

      socket.on('disconnect', function () {
        // Socket closed
        _this2._sockets.splice(_this2._sockets.indexOf(socket), 1);
      });
    }
  }, {
    key: 'start',
    value: function start() {
      this._onConnection();
      this._io.listen(this._port);
    }
  }, {
    key: 'stop',
    value: function stop() {
      // Stop accepting connections
      this._io.close();

      // Close each socket connection
      this._sockets.forEach(function (socket) {
        return socket.disconnect();
      });
    }
  }]);

  return Server;
}();

module.exports = Server;