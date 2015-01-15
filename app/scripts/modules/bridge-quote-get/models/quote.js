"use strict";

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

    //todo: remove this hack when quotes return unique id
    this.set("id", this.cid);
  },

  dispatchCallback: function(payload) {
    var handleAction = {};


    if (!_.isUndefined(handleAction[payload.actionType])) {
      handleAction[payload.actionType](payload.data);
    }
  }
});

//add validation mixin
_.extend(Quote.prototype, ValidationMixins);

module.exports = Quote;
