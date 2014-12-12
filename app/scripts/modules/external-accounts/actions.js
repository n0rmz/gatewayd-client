var adminDispatcher = require('../../dispatchers/admin-dispatcher');
var accountActions = require('./config.json').actions;

var actions = {
  updateUrl: function(path) {
    adminDispatcher.handleEvent({
      actionType: accountActions.updateUrl,
      data: path
    });
  },

  sendPaymentAttempt: function(payment) {
    adminDispatcher.handleEvent({
      actionType: accountActions.sendPaymentAttempt,
      data: payment
    });
  },

  createAccountComplete: function(payment) {
    adminDispatcher.handleEvent({
      actionType: accountActions.createAccountComplete,
      data: payment
    });
  },

  fetchExternalAccounts: function() {
    adminDispatcher.handleEvent({
      actionType: accountActions.fetchExternalAccounts
    });
  }
};

module.exports = actions;
