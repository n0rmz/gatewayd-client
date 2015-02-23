'use strict';

var path = require('path');
var _ = require('lodash');
var Backbone = require('backbone');
var adminDispatcher = require('scripts/dispatchers/admin-dispatcher');
var model = require('../models/balance');
var appConfig = require('app-config');

var Balances = Backbone.Collection.extend({
  model: model,

  initialize: function(models, options) {
    var walletTypeMap = {
      hot: 'balances',
      cold: 'liabilities'
    };

    if (!_.isUndefined(walletTypeMap[options.walletType])) {
      this.urlPath = path.join('v1', walletTypeMap[options.walletType]);
    }

    _.bindAll(this);

    adminDispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {};

    handleAction.fetchBalance] = this.fetchBalances;

    if (!_.isUndefined(handleAction[payload.actionType])) {
      handleAction[payload.actionType](payload.data);
    }
  },

  fetchBalances: function() {
    this.fetch({
      url: appConfig.baseUrl + path.join('/', this.urlPath)
    });
  },

  parse: function(data) {
    return data.balances;
  }
});

module.exports = Balances;
