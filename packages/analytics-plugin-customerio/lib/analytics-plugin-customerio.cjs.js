'use strict';

var CustomerIO;

{
  CustomerIO = require('customerio-node');
}
/**
 * Customer.io analytics server side integration. Uses https://github.com/customerio/customerio-node
 * @link https://getanalytics.io/plugins/customerio/
 * @link https://customer.io/docs/api/
 * @param {object} pluginConfig - Plugin settings
 * @param {string} pluginConfig.siteId - Customer.io site Id for server side tracking
 * @param {string} pluginConfig.apiKey - Customer.io API key for server side tracking
 * @return {object} Analytics plugin
 *
 * @example
 *
 * customerIOServer({
 *   siteId: '123-xyz',
 *   apiKey: '9876543'
 * })
 */


function customerIOServer() {
  var pluginConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // Allow for userland overides of base methods
  if (!pluginConfig.siteId) {
    throw new Error('customer.io siteId missing');
  }

  if (!pluginConfig.apiKey) {
    throw new Error('customer.io apiKey missing');
  }

  var client = new CustomerIO(pluginConfig.siteId, pluginConfig.apiKey);
  return {
    name: 'customerio',
    config: pluginConfig,
    // page view
    page: function page(_ref) {
      var payload = _ref.payload;
      var userId = payload.userId,
          properties = payload.properties;
      if (!userId) return false;
      client.trackPageView(userId, properties.url);
    },
    // track event
    track: function track(_ref2) {
      var payload = _ref2.payload;
      var userId = payload.userId,
          event = payload.event,
          properties = payload.properties;
      if (!userId) return false;
      client.track(userId, {
        name: event,
        data: properties
      });
    },
    // identify user
    identify: function identify(_ref3) {
      var payload = _ref3.payload;
      var userId = payload.userId,
          traits = payload.traits;
      client.identify(userId, traits);
    }
  };
}

/* This module will shake out unused code and work in browser and node 🎉 */

var index = customerIOServer;

module.exports = index;
