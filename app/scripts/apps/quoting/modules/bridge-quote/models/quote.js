'use strict';

var path = require('path');
var _ = require('lodash');
var $ = require('jquery');

var Backbone = require('backbone');

var reqlib = require('app-root-path').require;
var ValidationMixins = reqlib('/app/scripts/shared/mixins/models/validation-mixin');
var adminDispatcher = reqlib('/app/scripts/dispatchers/admin-dispatcher');
var appConfig = reqlib('/app/app-config.json');

Backbone.$ = $;

var Quote = Backbone.Model.extend({
  defaults: {
    source: {},
    wallet_payment: {
      destination: '',
      primary_amount: {
        amount: '',
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

  validationRules: {
    bridge_payments: ['isArray', 'minLength:1'],
    created: ['isString', 'minLength:1'],
    destination: ['isObject'],
    destination_amount: ['isObject'],
    id: ['isString'],
    parties: ['isObject'],
    source: ['isObject'],
    state: ['isString'],
    uuid: ['isString'],
    wallet_payment: ['isObject']
  },

  initialize: function() {
    _.bindAll(this);

    adminDispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {};

    handleAction.setAcceptQuoteUrl = this.setAcceptQuoteUrl;
    handleAction.submitQuote = this.submitQuote;

    if (!_.isUndefined(handleAction[payload.actionType])) {
      handleAction[payload.actionType](payload.data);
    }
  },

  // extract base url from bridge quote url to utilize gatewayd endpoint for submitting quote
  buildBridgePaymentsUrl: function(urlWithDomain) {
    var parser = document.createElement('a');

    parser.href = urlWithDomain;

    return parser.protocol + '//' + parser.host + '/v1/bridge_payments';
  },

  setAcceptQuoteUrl: function(urlWithDomain) {
    this.url = this.buildBridgePaymentsUrl(urlWithDomain);
  },

  submitQuote: function(quoteId) {
    if (quoteId !== this.id) {
      return false;
    }

    this.save({
      bridge_payments: [this.toJSON()]
    }, {
      type: 'POST',
      contentType: 'application/json'
    });
  }
});

//add validation mixin
_.extend(Quote.prototype, ValidationMixins);

module.exports = Quote;
