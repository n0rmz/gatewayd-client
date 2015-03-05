'use strict';

var _ = require('lodash');
var $ = require('jquery');
var heartbeats = require('heartbeats');

var Backbone = require('backbone');
var ValidationMixins = require('scripts/shared/mixins/models/validation-mixin');

var adminDispatcher = require('scripts/dispatchers/admin-dispatcher');
var appConfig = require('app-config.json');

var pollingHeart = new heartbeats.Heart(appConfig.pollingRate);

// TODO - figure out a way to make the spinner, that this heart is used for, independent
var instantHeart = new heartbeats.Heart(100);

Backbone.$ = $;

var Payment = Backbone.Model.extend({
  defaults: {
    id: 0,
    createdAt: 0,
    updatedAt: 0,
    uid: 0,
    client_resource_id: 0,
    to_address_id: 0,
    from_address_id: 0,
    to_amount: 0.0,
    to_currency: '',
    to_issuer: '',
    from_amount: 0.0,
    from_currency: '',
    from_issuer: '',
    transaction_state: '',
    transaction_hash: '',
    data: '',
    state: '',
    external_transaction_id: 0
  },

  validationRules: {
    to_address_id: {
      validators: ['isNumber'] // int
    },
    from_address_id: {
      validators: ['isNumber'] // int
    },
    to_amount: {
      validators: ['isNumber'] // decimal
    },
    to_currency: {
      validators: ['isString', 'minLength:1']
    },
    to_issuer: {
      validators: ['isString', 'minLength:1']
    },
    from_amount: {
      validators: ['isNumber'] // decimal
    },
    from_currency: {
      validators: ['isString', 'minLength:1']
    },
    from_issuer: {
      validators: ['isString', 'minLength:1']
    }
  },

  initialize: function() {
    _.bindAll(this);

    adminDispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {};

    handleAction.retryFailedPayment = this.retryFailedPayment;

    if (!_.isUndefined(handleAction[payload.actionType])) {
      handleAction[payload.actionType](payload.data);
    }
  },

  parse: function(data, options) {
    // fetching from collection uses model's parse method
    if (options.collection) {
      return data;
    }

    return data.ripple_transaction;
  },

  checkPollCompletion: function(model) {
    if (model.get('state') === 'succeeded' || model.get('state') === 'failed') {
      pollingHeart.clearEvents();
      this.trigger('polling', {id: this.id, isPolling: false});
    } else {
      this.trigger('polling', {id: this.id, isPolling: true});
    }
  },

  pollStatusHelper: function() {
    this.fetch({
      url: appConfig.baseUrl + '/v1/ripple_transactions/' + this.get('id'),
      dataType: 'json',
      contentType: 'application/json',
      success: this.checkPollCompletion
    });
  },

  pollStatus: function() {

    // trigger polling events as soon as possible before polling starts
    instantHeart.onceOnBeat(1, () => {
      this.trigger('polling', {id: this.id, isPolling: true});
    });

    // update displayed payment information every interval to watch status changes
    pollingHeart.onBeat(1, this.pollStatusHelper);

    // stop polling after X intervals, depending on config
    pollingHeart.onceOnBeat(appConfig.maxPollCount, () => {
      pollingHeart.clearEvents();
      this.trigger('polling', {id: this.id, isPolling: false});
    });
  },

  retryFailedPayment: function(id) {
    if (id !== this.get('id')) {
      return false;
    }

    this.save(null, {
      type: 'post',
      url: appConfig.baseUrl + '/v1/payments/failed/' + this.get('id') + '/retry',
      contentType: 'application/json',
      success: this.pollStatus
    });
  },
});

//add validation mixin
_.extend(Payment.prototype, ValidationMixins);

module.exports = Payment;
