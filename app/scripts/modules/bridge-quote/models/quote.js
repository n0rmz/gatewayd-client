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

  initialize: function() {
    _.bindAll(this);

    adminDispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {};

    handleAction[quoteConfigActions.setAcceptQuoteUrl] = this.setAcceptQuoteUrl;
    handleAction[quoteConfigActions.submitQuote] = this.submitQuote;

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
    var credentials = '';

    if (quoteId !== this.id) {
      return false;
    }

    this.save({
      bridge_payments: [this.toJSON()]
    }, {
      type: 'POST',
      contentType: 'application/json',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', credentials);
      }
    });
  }
});

//add validation mixin
_.extend(Quote.prototype, ValidationMixins);

module.exports = Quote;
