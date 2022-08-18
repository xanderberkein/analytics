var analyticsCustomerio = (function () {
  'use strict';

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  /* global _cio */

  /**
   * Customer.io analytics integration
   * @link https://getanalytics.io/plugins/customerio/
   * @link https://customer.io/docs/javascript-quick-start
   * @param {object} pluginConfig - Plugin settings
   * @param {string} pluginConfig.siteId - Customer.io site Id for client side tracking
   * @param {string} pluginConfig.customScriptSrc - Load Customer.io script from custom source
   * @param {boolean} [pluginConfig.disableAnonymousTraffic] -  Disable anonymous events from firing
   * @return {object} Analytics plugin
   * @example
   *
   * customerIOPlugin({
   *   siteId: '123-xyz'
   * })
   */
  function customerIOPlugin() {
    var pluginConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // Because customer.io automatically fired a page view onLoad
    // We need to ignore the first .page() call
    var initialPageViewFired = false;
    return {
      name: 'customerio',
      config: pluginConfig,
      initialize: function initialize(_ref) {
        var config = _ref.config;
        var siteId = config.siteId,
            customScriptSrc = config.customScriptSrc;

        if (!siteId) {
          throw new Error('No customer.io siteId defined');
        }

        if (typeof _cio === 'undefined') {
          window._cio = [];

          (function () {
            var a, b, c;

            a = function a(f) {
              return function () {
                _cio.push([f].concat(Array.prototype.slice.call(arguments, 0)));
              };
            };

            b = ['load', 'identify', 'sidentify', 'track', 'page'];

            for (c = 0; c < b.length; c++) {
              _cio[b[c]] = a(b[c]);
            }

            var t = document.createElement('script');
            var s = document.getElementsByTagName('script')[0];
            t.async = true;
            t.id = 'cio-tracker';
            t.setAttribute('data-site-id', siteId);
            t.src = customScriptSrc || 'https://assets.customer.io/assets/track.js';
            s.parentNode.insertBefore(t, s);
          })();
        }
      },
      page: function page(_ref2) {
        var payload = _ref2.payload,
            config = _ref2.config;
        if (config.disableAnonymousTraffic && !payload.userId) return;
        /* ignore the first .page() call b/c customer.io already fired it */

        if (!initialPageViewFired) {
          initialPageViewFired = true;
          return;
        }

        if (typeof _cio !== 'undefined') {
          _cio.page(document.location.href, payload.properties);
        }
      },
      reset: function reset(_ref3) {
        var instance = _ref3.instance;

        /* Clear customer.io cookies on reset */
        var storage = instance.storage;
        var opts = {
          storage: 'cookie'
        };
        storage.removeItem('_cio', opts);
        storage.removeItem('_cioid', opts);
      },
      track: function track(_ref4) {
        var payload = _ref4.payload,
            config = _ref4.config;
        if (config.disableAnonymousTraffic && !payload.userId) return;

        if (typeof _cio !== 'undefined') {
          _cio.track(payload.event, payload.properties);
        }
      },
      identify: function identify(_ref5) {
        var payload = _ref5.payload;
        var userId = payload.userId,
            traits = payload.traits;

        if (typeof _cio !== 'undefined' && userId) {
          _cio.identify(_objectSpread({
            id: userId
          }, traits));
        }
      },
      loaded: function loaded() {
        return !!(window._cio && window._cio.push !== Array.prototype.push);
      }
    };
  }

  /* This module will shake out unused code and work in browser and node 🎉 */

  var index = customerIOPlugin ;

  return index;

})();
