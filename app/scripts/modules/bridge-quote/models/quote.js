"use strict";

var path = require('path');
var _ = require('lodash');
var $ = require('jquery');

var Backbone = require('backbone');
var ValidationMixins = require('../../../shared/helpers/validation_mixin');

var adminDispatcher = require('../../../dispatchers/admin-dispatcher');
var quoteActions = require('../config.json').actions;

Backbone.$ = $;

var Quote = Backbone.Model.extend({
  defaults: {
    direction: '', // to-ripple/from-ripple
    state    : 'invoice',
    ripple: {
      destination_address  : '', // ripple address
      destination_amount   : 0,
      destination_currency : '',
      source_currency      : '',
      source_amount        : 0
    },
    external: {
      source_address       : '', // starts with 'acct:'
      destination_address  : '', // starts with 'acct:'
      destination_currency : '',
      destination_amount   : 0
    }
  },

  initialize: function() {
    _.bindAll(this);

    adminDispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    if (!_.isUndefined(this[payload.actionType])) {
      this[payload.actionType](payload.data);
    }
  }
});

//add validation mixin
_.extend(Quote.prototype, ValidationMixins);

module.exports = Quote;
