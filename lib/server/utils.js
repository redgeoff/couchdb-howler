"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, [{
    key: "_success",
    value: function _success(callback, obj) {
      callback(obj || {});
    }
  }, {
    key: "_failure",
    value: function _failure(callback, err) {
      // For some reason the linter requires obj to be defined before it is used with callback()
      var obj = {
        error: true,
        errorName: err.name,
        errorMessage: err.message
      };
      callback(obj);
    }
  }, {
    key: "respond",
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(callback, promiseFactory) {
        var r;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;

                if (!promiseFactory) {
                  _context.next = 7;
                  break;
                }

                _context.next = 4;
                return promiseFactory();

              case 4:
                _context.t0 = _context.sent;
                _context.next = 8;
                break;

              case 7:
                _context.t0 = {};

              case 8:
                r = _context.t0;

                this._success(callback, r);
                _context.next = 15;
                break;

              case 12:
                _context.prev = 12;
                _context.t1 = _context["catch"](0);

                this._failure(callback, _context.t1);

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 12]]);
      }));

      function respond(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return respond;
    }()
  }]);

  return Utils;
}();

module.exports = new Utils();