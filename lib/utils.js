'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, [{
    key: 'isError',
    value: function isError(response) {
      return !!response.error;
    }
  }, {
    key: 'responseToError',
    value: function responseToError(response) {
      var err = new Error(response.errorMessage);
      err.name = response.errorName;
      return err;
    }
  }, {
    key: 'errorToResponse',
    value: function errorToResponse(err) {
      return {
        error: true,
        errorName: err.name,
        errorMessage: err.message
      };
    }

    // TODO: move to sporks

  }, {
    key: '_toQueryString',
    value: function _toQueryString(params) {
      // Source: https://stackoverflow.com/a/34209399/2831606
      return Object.keys(params).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
      }).join('&');
    }
  }]);

  return Utils;
}();

module.exports = new Utils();