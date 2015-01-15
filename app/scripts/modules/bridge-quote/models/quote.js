"use strict";

// todo: clean this up and modularize with variable file name/path
// handle secrets. Make npm module for this in the future
var secrets = require('../../../../../secrets');

var path = require('path');
var _ = require('lodash');
var $ = require('jquery');

var Backbone = require('backbone');
var ValidationMixins = require('../../../shared/helpers/validation_mixin');

var adminDispatcher = require('../../../dispatchers/admin-dispatcher');
var quoteConfigActions = require('../config.json').actions;

Backbone.$ = $;

var Quote = Backbone.Model.extend({
  defaults: {
    source: {},
    wallet_payment: {
      destination: '',
      primary_amount: {
        amount: '', // number
        currency: '',
        issuer: ''
      }
    },
    destination: {
      uri: ''
    },
    destination_amount: {},
    parties: {}
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
