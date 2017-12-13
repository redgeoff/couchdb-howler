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
  function Command() {
    _classCallCheck(this, Command);
  }

  _createClass(Command, [{
    key: '_usage',
    value: function _usage(argv) {
      this._argv = (0, _yargs2.default)(argv).usage('Usage: $0 [options]').example('$0 --couchdb-url https://admin:admin@localhost:5984 --port 3000').alias('u', 'couchdb-url').nargs('couchdb-url', 1).describe('couchdb-url', 'URL to the CouchDB cluster').alias('p', 'port').nargs('p', 1).describe('p', 'Port').default('p', 3000).help('h').alias('h', 'help').version('v').alias('v', 'version').demandOption(['couchdb-url']).epilog('Copyright 2017').argv;
    }
  }, {
    key: '_start',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _this = this;

        var server;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                server = new _server2.default(this._argv);
                _context2.next = 4;
                return server.start();

              case 4:

                // Gracefully handle SIGINT signals
                process.on('SIGINT', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _log2.default.info('Stopping as received SIGNINT');
                          _context.next = 3;
                          return server.stop();

                        case 3:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                })));
                _context2.next = 18;
                break;

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2['catch'](0);
                _context2.prev = 9;
                _context2.next = 12;
                return server.stop();

              case 12:
                _context2.next = 17;
                break;

              case 14:
                _context2.prev = 14;
                _context2.t1 = _context2['catch'](9);

                _log2.default.error('failed to stop');

              case 17:
                _log2.default.fatal(_context2.t0);

              case 18:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 7], [9, 14]]);
      }));

      function _start() {
        return _ref.apply(this, arguments);
      }

      return _start;
    }()
  }, {
    key: 'run',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(argv) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this._usage(argv);
                _context3.next = 3;
                return this._start();

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function run(_x) {
        return _ref3.apply(this, arguments);
      }

      return run;
    }()
  }]);

  return Command;
}();

module.exports = Command;