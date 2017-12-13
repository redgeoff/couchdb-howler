'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sporks = require('sporks');

var _sporks2 = _interopRequireDefault(_sporks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Notifier = function () {
  function Notifier() {
    _classCallCheck(this, Notifier);

    this._sockets = {};
    this._socketsByDBName = {};
  }

  _createClass(Notifier, [{
    key: '_addToSockets',
    value: function _addToSockets(socket, dbName) {
      if (!this._sockets[socket.id]) {
        this._sockets[socket.id] = {
          socket: socket,
          dbNames: []
        };
      }

      this._sockets[socket.id].dbNames[dbName] = true;
    }
  }, {
    key: '_addToSocketsByDBName',
    value: function _addToSocketsByDBName(socket, dbName) {
      if (!this._socketsByDBName[dbName]) {
        this._socketsByDBName[dbName] = {};
      }

      this._socketsByDBName[dbName][socket.id] = socket;
    }
  }, {
    key: 'subscribe',
    value: function subscribe(socket, dbName) {
      this._addToSockets(socket, dbName);
      this._addToSocketsByDBName(socket, dbName);
    }
  }, {
    key: '_removeFromSockets',
    value: function _removeFromSockets(socket, dbName) {
      delete this._sockets[socket.id].dbNames[dbName];

      // No more dbNames for this socket?
      if (_sporks2.default.length(this._sockets[socket.id].dbNames) === 0) {
        delete this._sockets[socket.id];
      }
    }
  }, {
    key: '_removeFromSocketsByDBName',
    value: function _removeFromSocketsByDBName(socket, dbName) {
      delete this._socketsByDBName[dbName][socket.id];

      // No more sockets for this dbName?
      if (_sporks2.default.length(this._socketsByDBName[dbName]) === 0) {
        delete this._socketsByDBName[dbName];
      }
    }
  }, {
    key: '_unsubscribeDBName',
    value: function _unsubscribeDBName(socket, dbName) {
      this._removeFromSockets(socket, dbName);
      this._removeFromSocketsByDBName(socket, dbName);
    }
  }, {
    key: 'unsubscribe',
    value: function unsubscribe(socket, dbName) {
      var _this = this;

      if (!dbName) {
        // No dbName specified so remove from all dbNames
        this._sockets[socket.id].dbNames.forEach(function (dbName) {
          _this._unsubscribeDBName(socket, dbName);
        });
      } else {
        this._unsubscribeDBName(socket, dbName);
      }
    }
  }]);

  return Notifier;
}();

module.exports = Notifier;