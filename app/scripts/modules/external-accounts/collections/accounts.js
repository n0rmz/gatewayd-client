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
      },
      success: function() {

        // TODO - is there a faster way to do this without multiple collection iterations?
        var newIds, diffIds;

        // 'new' attribute is reset for all existing account models
        if (!ids.length) {
          _.each(_this.models, function(model) {
            model.set('new', false);
          });

          return true;
        }

        // array of current account ids after fetch
        newIds = _.pluck(_this.models, 'id');

        // array of account ids existing only in newIds
        diffIds = _.reject(newIds, function(id) {
          return ids.indexOf(id) > -1;
        });

        _.each(_this.models, function(model) {

          // accounts whose model Ids are in diffIds get a 'new' attribute
          // 'new' models will be highlighted
          if (diffIds.indexOf(model.get('id')) > -1) {
            model.set('new', true);
          } else {
            model.set('new', false);
          }
        });
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
