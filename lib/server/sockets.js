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
          dbNames: {}
        };
      }
    }
  }, {
    key: 'remove',
    value: function remove(socket) {
      var _this = this;

      // Remove any corresponding entries in socketsByDBName
      _sporks2.default.each(this._sockets[socket.id].dbNames, function (key, dbName) {
        _this._unsubscribeFromDB(socket, dbName);
      });

      // Remove the socket
      delete this._sockets[socket.id];
    }
  }, {
    key: 'get',
    value: function get(id) {
      return this._sockets[id];
    }
  }, {
    key: 'getByDBName',
    value: function getByDBName(dbName) {
      return this._socketsByDBName[dbName];
    }
  }, {
    key: 'setCookie',
    value: function setCookie(socket, cookie) {
      this._sockets[socket.id].cookie = cookie;
    }

    // getCookie (socket) {
    //   return this._sockets[socket.id].cookie
    // }

    // clearCookie (socket) {
    //   delete this._sockets[socket.id].cookie
    // }

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
    key: '_subscribeToDB',
    value: function _subscribeToDB(socket, dbName) {
      this._addDBToSockets(socket, dbName);
      this._addDBToSocketsByDBName(socket, dbName);
    }
  }, {
    key: 'subscribe',
    value: function subscribe(socket, dbNames) {
      var _this2 = this;

      dbNames.forEach(function (dbName) {
        return _this2._subscribeToDB(socket, dbName);
      });
    }
  }, {
    key: '_removeDBFromSockets',
    value: function _removeDBFromSockets(socket, dbName) {
      delete this._sockets[socket.id].dbNames[dbName];
    }
  }, {
    key: '_removeDBFromSocketsByDBName',
    value: function _removeDBFromSocketsByDBName(socket, dbName) {
      if (this._socketsByDBName[dbName]) {
        delete this._socketsByDBName[dbName][socket.id];
      }

      // No more sockets for this dbName?
      if (_sporks2.default.length(this._socketsByDBName[dbName]) === 0) {
        delete this._socketsByDBName[dbName];
      }
    }
  }, {
    key: '_unsubscribeFromDB',
    value: function _unsubscribeFromDB(socket, dbName) {
      this._removeDBFromSockets(socket, dbName);
      this._removeDBFromSocketsByDBName(socket, dbName);
    }
  }, {
    key: 'unsubscribe',
    value: function unsubscribe(socket, dbNames) {
      var _this3 = this;

      dbNames.forEach(function (dbName) {
        return _this3._unsubscribeFromDB(socket, dbName);
      });
    }
  }, {
    key: 'close',
    value: function close() {
      var _this4 = this;

      // Close each socket connection
      _sporks2.default.each(this._sockets, function (socket) {
        socket.disconnect();
        _this4.remove(socket);
      });
    }
  }]);

  return Sockets;
}();

module.exports = Sockets;