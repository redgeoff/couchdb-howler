'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sporks = require('sporks');

var _sporks2 = _interopRequireDefault(_sporks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sockets = function () {
  function Sockets() {
    _classCallCheck(this, Sockets);

    this._sockets = {};
    this._socketsByDBName = {};
  }

  _createClass(Sockets, [{
    key: 'add',
    value: function add(socket) {
      if (!this._sockets[socket.id]) {
        this._sockets[socket.id] = {
          socket: socket,
          dbNames: []
        };
      }
    }
  }, {
    key: 'remove',
    value: function remove(socket) {
      var _this = this;

      // Remove any corresponding entries in socketsByDBName
      this._sockets[socket.id].dbNames.forEach(function (dbName) {
        _this._unsubscribe(socket, dbName);
      });

      // Remove the socket
      delete this._sockets[socket.id];
    }
  }, {
    key: 'setCookie',
    value: function setCookie(socket, cookie) {
      this._sockets[socket.id].cookie = cookie;
    }
  }, {
    key: 'getCookie',
    value: function getCookie(socket) {
      return this._sockets[socket.id].cookie;
    }
  }, {
    key: 'clearCookie',
    value: function clearCookie(socket) {
      delete this._sockets[socket.id].cookie;
    }
  }, {
    key: 'throwIfNotAuthenticated',
    value: function throwIfNotAuthenticated(socket) {
      // Currently, we just check to see if a cookie exists. Validation of the cookie happens when the
      // client connects/reconnects.
      //
      // FUTURE: We may want to introduce a more sophisticated check that requires certain roles,
      // etc...
      if (!this.getCookie(socket)) {
        var err = new Error('not authenticated via cookie');
        err.name = 'NotAuthenticatedError';
        throw err;
      }
    }
  }, {
    key: '_addDBToSockets',
    value: function _addDBToSockets(socket, dbName) {
      this._sockets[socket.id].dbNames[dbName] = true;
    }
  }, {
    key: '_addDBToSocketsByDBName',
    value: function _addDBToSocketsByDBName(socket, dbName) {
      if (!this._socketsByDBName[dbName]) {
        this._socketsByDBName[dbName] = {};
      }

      this._socketsByDBName[dbName][socket.id] = socket;
    }
  }, {
    key: 'subscribe',
    value: function subscribe(socket, dbName) {
      this._addDBToSockets(socket, dbName);
      this._addDBToSocketsByDBName(socket, dbName);
    }
  }, {
    key: '_removeDBFromSockets',
    value: function _removeDBFromSockets(socket, dbName) {
      delete this._sockets[socket.id].dbNames[dbName];
    }
  }, {
    key: '_removeDBFromSocketsByDBName',
    value: function _removeDBFromSocketsByDBName(socket, dbName) {
      delete this._socketsByDBName[dbName][socket.id];

      // No more sockets for this dbName?
      if (_sporks2.default.length(this._socketsByDBName[dbName]) === 0) {
        delete this._socketsByDBName[dbName];
      }
    }
  }, {
    key: 'unsubscribe',
    value: function unsubscribe(socket, dbName) {
      this._removeDBFromSockets(socket, dbName);
      this._removeDBFromSocketsByDBName(socket, dbName);
    }
  }, {
    key: 'close',
    value: function close() {
      // Close each socket connection
      _sporks2.default.each(this._sockets, function (socket) {
        return socket.disconnect();
      });
    }
  }]);

  return Sockets;
}();

module.exports = Sockets;