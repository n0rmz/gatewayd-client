"use strict";

var path = require('path');
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

    handleAction[quoteConfigActions.setQuotingUrl] = this.setQuotingUrl;
    handleAction[quoteConfigActions.updateUrlWithParams] = this.updateUrlWithParams;
    handleAction[quoteConfigActions.fetchQuotes] = this.fetchQuotes;

    if (!_.isUndefined(handleAction[payload.actionType])) {
      handleAction[payload.actionType](payload.data);
    }
  },

  setQuotingUrl: function(newUrl) {
    if (_.isEmpty(newUrl) || _.isUndefined(newUrl)) {
      return false;
    }

    this.baseUrl = newUrl;
  },

  // update template url with real params
  updateUrlWithParams: function(quoteQueryParams) {
    if (_.isUndefined(quoteQueryParams) || _.isEmpty(quoteQueryParams)) {
      return false;
    }

    // used when bridge quote base url is similar to http://domain.com/{sender}/{receiver}/{amount}
    // var updatedUrl = this.baseUrl;
    // updatedUrl = updatedUrl.replace(/{sender}/, quoteQueryParams.source_address);
    // updatedUrl = updatedUrl.replace(/{receiver}/, quoteQueryParams.destination_address);
    // updatedUrl = updatedUrl.replace(/{amount}/,
    //   quoteQueryParams.destination_amount + '+' + quoteQueryParams.destination_currency);
    // this.url = updatedUrl;

    // used when bridge quote base url is similar to http://domain.com
    this.url = this.baseUrl + path.join(
      '/',
      'quotes',
      encodeURIComponent('acct:' + quoteQueryParams.source_address),
      encodeURIComponent('acct:' + quoteQueryParams.destination_address),
      quoteQueryParams.destination_amount + '+' + quoteQueryParams.destination_currency
    );
  },

  fetchQuotes: function() {
    var credentials = '';

    this.fetch({
      contentType: 'application/json',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', credentials);
      }
    });
  },

  parse: function(data) {
    return data.bridge_payments;
  }
});

module.exports = Quotes;
