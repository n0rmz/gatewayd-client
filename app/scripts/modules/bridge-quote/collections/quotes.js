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
    return b.id - a.id; // by cheapest path?
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
