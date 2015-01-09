"use strict";

var adminDispatcher = require('../../dispatchers/admin-dispatcher');
var quoteActions = require('./config.json').actions;

var actions = {
  reset: function() {
    adminDispatcher.handleEvent({
      actionType: quoteActions.reset
    });
  },

  updateAttributeData: function(fieldName, fieldValue) {
    adminDispatcher.handleEvent({
      actionType: quoteActions.updateAttributeData,
      data: {
        fieldName: fieldName,
        fieldValue: fieldValue
      }
    });
  },

  sendPaymentComplete: function(payment) {
    adminDispatcher.handleEvent({
      actionType: quoteActions.sendPaymentComplete,
      data: payment
    });
  }
};

module.exports = actions;
