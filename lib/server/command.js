'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Command = function () {
  function Command(argv) {
    _classCallCheck(this, Command);

    this._usage(argv);
    this._createServer();
  }

  _createClass(Command, [{
    key: '_usage',
    value: function _usage(argv) {
      this._argv = (0, _yargs2.default)(argv).usage('Usage: $0 [options]').example('$0 --couchdb_url https://admin:admin@localhost:5984 --port 3000').alias('u', 'couchdb_url').nargs('couchdb_url', 1).describe('couchdb_url', 'URL to the CouchDB cluster').alias('p', 'port').nargs('p', 1).describe('p', 'Port').default('p', 3000).alias('l', 'log_level').nargs('l', 1).describe('l', ['error|warn|info|debug. Setting a particular level implies that all log records at that', 'level and above are logged.'].join(' ')).default('l', 'info').help('h').alias('h', 'help')

      // Note: yargs version functionality disabled or else it causes problems
      // .version('v')
      .describe('v', 'Show version number').alias('v', 'version').demandOption(['couchdb_url']).epilog('Copyright 2017').argv;
    }
  }, {
    key: '_stop',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this._server.stop();

              case 2:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _stop() {
        return _ref.apply(this, arguments);
      }

      return _stop;
    }()
  }, {
    key: '_onSigIntFactory',
    value: function _onSigIntFactory() {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _log2.default.info('Stopping as received SIGINT');
                _context2.next = 3;
                return _this._stop();

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this);
      }));
    }
  }, {
    key: '_onFatalError',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(err) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this._stop();

              case 3:
                _context3.next = 8;
                break;

              case 5:
                _context3.prev = 5;
                _context3.t0 = _context3['catch'](0);

                _log2.default.error('failed to stop');

              case 8:
                _log2.default.fatal(err);

              case 9:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 5]]);
      }));

      function _onFatalError(_x) {
        return _ref3.apply(this, arguments);
      }

      return _onFatalError;
    }()
  }, {
    key: '_createServer',
    value: function _createServer() {
      this._server = new _server2.default(this._argv);

      // Gracefully handle SIGINT signals
      process.on('SIGINT', this._onSigIntFactory());
    }
  }, {
    key: '_start',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return this._server.start();

              case 3:
                _context4.next = 9;
                break;

              case 5:
                _context4.prev = 5;
                _context4.t0 = _context4['catch'](0);
                _context4.next = 9;
                return this._onFatalError(_context4.t0);

              case 9:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 5]]);
      }));

      function _start() {
        return _ref4.apply(this, arguments);
      }

      return _start;
    }()
  }, {
    key: 'run',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(argv) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this._start();

              case 2:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function run(_x2) {
        return _ref5.apply(this, arguments);
      }

      return run;
    }()
  }]);

  return Command;
}();

module.exports = Command;