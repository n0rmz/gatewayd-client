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
    return b.id - a.id; // by cheapest path?
  },

  initialize: function() {
    _.bindAll(this);

    adminDispatcher.register(this.dispatcherCallback);
  },

  dispatcherCallback: function(payload) {
    var handleAction = {};

    handleAction[quoteConfigActions.setTemplateUrl] = this.setTemplateUrl;
    handleAction[quoteConfigActions.updateUrlWithParams] = this.updateUrlWithParams;
    handleAction[quoteConfigActions.fetchQuotes] = this.fetchQuotes;

    if (!_.isUndefined(this[payload.actionType])) {
      this[payload.actionType](payload.data);
    }
  },

  // sets the url based on webfinger templated links
  setTemplateUrl: function(newQuotingUrl) {
    if (_.isUndefined(newQuotingUrl)) {
      return false;
    }

    this.url = newQuotingUrl;
  },

  // update template url with real params
  updateUrlWithParams: function(quoteQueryParams) {
    if (_.isUndefined(quoteQueryParams) || _.isEmpty(quoteQueryParams)) {
      return false;
    }

    var external = this.get('external');
    var updatedUrl = this.url;

    updatedUrl = updatedUrl.replace(/{sender}/, quoteQueryParams.source_address);
    updatedUrl = updatedUrl.replace(/{receiver}/, quoteQueryParams.destination_address);
    updatedUrl = updatedUrl.replace(/{amount}/,
      quoteQueryParams.destination_amount + '+' + quoteQueryParams.destination_currency);

    this.url = updatedUrl;
  },

  fetchQuotes: function(quoteQueryParams) {

    // DELETE STUB DATA WHEN ENDPOINT IS COMPLETE
    var stubData = [{
      direction: 'to-ripple',
      state    : 'invoice',
      ripple: {
        destination_address  : 'r123456789',
        destination_amount   : 0.0001,
        destination_currency : 'USD',
        source_currency      : 'XRP',
        source_amount        : 0.00000000000003
      },
      external: {
        source_address       : 'acct:rod@bankoftherod.com',
        destination_address  : 'acct:rod2@bankoftherod.com',
        destination_currency : 'USD',
        destination_amount   : 0.0001
      }
    }];

    this.set(stubData);

    this.trigger('ready', this);

    this.updateUrlWithParams(quoteQueryParams);

    // TODO - use a real fetch when endpoint is complete
    // this.fetch({});
  },

  parse: function(data) {
    return data.bridge_payments;
  }
});

module.exports = Quotes;
