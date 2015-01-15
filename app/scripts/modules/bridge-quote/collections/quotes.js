"use strict";

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var adminDispatcher = require('../../../dispatchers/admin-dispatcher');
var quoteConfigActions = require('../config.json').actions;
var Model = require('../models/quote');

Backbone.$ = $;

var Quotes = Backbone.Collection.extend({
  model: Model,

  comparator: function(a, b) {

    // sort by lowest currency value (not necessarily the cheapest)
    return a.wallet_payment.primary_amount.amount - b.wallet_payment.primary_amount.amount;
  },

  initialize: function() {
    _.bindAll(this);

    adminDispatcher.register(this.dispatcherCallback);
  },

  dispatcherCallback: function(payload) {
    var handleAction = {};

    if (!_.isUndefined(handleAction[payload.actionType])) {
      handleAction[payload.actionType](payload.data);
    }
  },

  parse: function(data) {
    return data.bridge_payments;
  }
});

module.exports = Quotes;
