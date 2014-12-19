"use strict";

var _ = require('lodash');
var $ = require('jquery');
var heartbeats = require('heartbeats');

var Backbone = require('backbone');
var ValidationMixins = require('../../../shared/helpers/validation_mixin');

var adminDispatcher = require('../../../dispatchers/admin-dispatcher');
var paymentConfigActions = require('../config.json').actions;
var session = require('../../../modules/session/models/session');

var pollingHeart = new heartbeats.Heart(5000);

Backbone.$ = $;

var Payment = Backbone.Model.extend({
  defaults: {
    id: 0,
    amount: 0.0,
    currency: '',
    deposit: true,
    external_account_id: 0,
    status: '',
    ripple_transaction_id: 0,
    uid: '',
    data: '',
    invoice_id: '',
    to_account_id: 0
    // from_account_id: 0 // this doesn't work
  },

  validationRules: {
    amount: {
      validators: ['isRequired', 'isNumber']
    },
    currency: {
      validators: ['isRequired', 'isString', 'minLength:1']
    },
    deposit: {
      validators: ['isRequired', 'isBoolean']
    },
    external_account_id: {
      validators: ['isRequired', 'isNumber']
    }
  },

  initialize: function() {
    _.bindAll(this);

    adminDispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {};

    if (!_.isUndefined(handleAction[payload.actionType])) {
      handleAction[payload.actionType](payload.data);
    }
  },

  parse: function(data, options) {
    // fetching from collection uses model's parse method
    if (options.collection) {
      return data;
    }

    return data.external_transaction;
  },

  checkPollCompletion: function(model) {
    if (model.get('status') === 'cleared') {
      pollingHeart.clearEvents();
      this.trigger('pollingStop');
    }
  },

  pollStatusHelper: function() {
    this.fetch({
      url: session.get('gatewaydUrl') + '/v1/external_transactions/' + this.get('id'),
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        Authorization: session.get('credentials')
      },
      success: this.checkPollCompletion
    });
  },

  pollStatus: function() {
    var _this = this;

    // update displayed payment information every interval to watch status changes
    pollingHeart.onBeat(1, this.pollStatusHelper);
    pollingHeart.onceOnBeat(0, this.trigger('pollingStart'));

    // stop polling after 10 intervals
    pollingHeart.onceOnBeat(10, function() {
      pollingHeart.clearEvents();
      _this.trigger('pollingStop');
    });
  }
});

//add validation mixin
_.extend(Payment.prototype, ValidationMixins);

module.exports = Payment;