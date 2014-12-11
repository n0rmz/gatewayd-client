var adminDispatcher = require('../../dispatchers/admin-dispatcher');
var paymentActions = require('./config.json').actions;

var actions = {
  updateUrl: function(path) {
    adminDispatcher.handleEvent({
      actionType: paymentActions.updateUrl,
      data: path
    });
  },

  flagAsDone: function(id) {
    adminDispatcher.handleEvent({
      actionType: paymentActions.flagAsDone,
      data: id
    });
  },

  sendPaymentAttempt: function(payment) {
    adminDispatcher.handleEvent({
      actionType: paymentActions.sendPaymentAttempt,
      data: payment
    });
  },

  sendPaymentComplete: function(payment) {
    adminDispatcher.handleEvent({
      actionType: paymentActions.sendPaymentComplete,
      data: payment
    });
  },

  fetchExternalTransactions: function() {
    adminDispatcher.handleEvent({
      actionType: paymentActions.fetchExternalTransactions
    });
  }
};

module.exports = actions;
