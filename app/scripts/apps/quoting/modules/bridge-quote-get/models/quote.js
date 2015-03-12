'use strict';

var path = require('path');
var _ = require('lodash');
var $ = require('jquery');

var Backbone = require('backbone');
var ValidationMixins = require('scripts/shared/mixins/models/validation-mixin');

var adminDispatcher = require('scripts/dispatchers/admin-dispatcher');

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
    this.set('id', this.cid);
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
