"use strict";

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var adminDispatcher = require('../../../dispatchers/admin-dispatcher');
var accountConfigActions = require('../config.json').actions;
var session = require('../../../modules/session/models/session');
var Model = require('../models/account.js');

Backbone.$ = $;

var Accounts = Backbone.Collection.extend({

  model: Model,

  comparator: function(a, b) {
    return b.id - a.id;
  },

  initialize: function() {
    _.bindAll(this);

    adminDispatcher.register(this.dispatcherCallback);
  },

  dispatcherCallback: function(payload) {
    var handleAction = {};

    handleAction[accountConfigActions.updateUrl] = this.updateUrl;
    handleAction[accountConfigActions.fetchExternalAccounts] = this.fetchExternalAccounts;
    handleAction[accountConfigActions.createAccountComplete] = this.createAccountComplete;

    if (!_.isUndefined(this[payload.actionType])) {
      this[payload.actionType](payload.data);
    }
  },

  urlObject: {
    "accounts": {
      "path":"/v1/external_accounts",
      "method": "get"
    }
  },

  updateUrl: function(page) {
    page = page.split('/')[1];

    if (!page || _.isUndefined(this.urlObject[page])) {
      return false;
    }

    this.url = session.get('gatewaydUrl') + this.urlObject[page].path;
    this.httpMethod = this.urlObject[page].method;

    this.fetchExternalAccounts();
  },

  fetchExternalAccounts: function() {
    var _this = this;

    // array of current account ids
    var ids = _.pluck(this.models, 'id');

    this.fetch({
      headers: {
        Authorization: session.get('credentials')
      }
    });
  },

  parse: function(data) {
    return data.external_accounts;
  },

  createAccountComplete: function(accountData) {
    this.fetch({
      headers: {
        Authorization: session.get('credentials')
      }
    });
  }
});

module.exports = Accounts;
