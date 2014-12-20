"use strict";

var adminDispatcher = require('../../dispatchers/admin-dispatcher');
var accountActions = require('./config.json').actions;

var actions = {
  updateUrl: function(path) {
    adminDispatcher.handleEvent({
      actionType: accountActions.updateUrl,
      data: path
    });
  },

  reset: function() {
    adminDispatcher.handleEvent({
      actionType: accountActions.reset
    });
  },

  validateField: function(fieldName, fieldValue) {
    adminDispatcher.handleEvent({
      actionType: accountActions.validateField,
      data: {
        fieldName: fieldName,
        fieldValue: fieldValue
      }
    });
  },

  createAccountAttempt: function(account) {
    adminDispatcher.handleEvent({
      actionType: accountActions.createAccountAttempt,
      data: account
    });
  },

  createAccountComplete: function(account) {
    adminDispatcher.handleEvent({
      actionType: accountActions.createAccountComplete,
      data: account
    });
  },

  fetchExternalAccounts: function() {
    adminDispatcher.handleEvent({
      actionType: accountActions.fetchExternalAccounts
    });
  }
};

module.exports = actions;
