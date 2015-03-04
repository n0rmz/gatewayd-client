'use strict';

var path = require('path');
var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var adminDispatcher = require('scripts/dispatchers/admin-dispatcher');
var Model = require('../models/account');
var appConfig = require('app-config.json');

Backbone.$ = $;

var Accounts = Backbone.Collection.extend({

  model: Model,

  comparator: function(a, b) {
    return b.id - a.id;
  },

  initialize: function() {
    _.bindAll(this);

    adminDispatcher.register(this.dispatcherCallback);
    this.url = appConfig.baseUrl + path.join('/', 'v1', 'external_accounts');
    this.fetchExternalAccounts();
  },

  dispatcherCallback: function(payload) {
    var handleAction = {};

    handleAction.fetchExternalAccounts = this.fetchExternalAccounts;
    handleAction.createAccountComplete = this.createAccountComplete;

    if (!_.isUndefined(this[payload.actionType])) {
      this[payload.actionType](payload.data);
    }
  },

  fetchExternalAccounts: function() {
    this.fetch({});
  },

  parse: function(data) {
    return data.external_accounts;
  },

  createAccountComplete: function(accountData) {
    this.fetchExternalAccounts();
  }
});

module.exports = Accounts;
