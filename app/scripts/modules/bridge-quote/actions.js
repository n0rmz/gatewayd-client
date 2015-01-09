"use strict";

var adminDispatcher = require('../../dispatchers/admin-dispatcher');
var quoteActions = require('./config.json').actions;

var actions = {
  setQuotingUrl: function(newQuotingUrl) {
    adminDispatcher.handleEvent({
      actionType: quoteActions.setQuotingUrl,
      data: newQuotingUrl
    });
  },

  updateUrlWithParams: function(quoteQueryParams) {
    adminDispatcher.handleEvent({
      actionType: quoteActions.updateUrlWithParams,
      data: quoteQueryParams
    });
  },

  flagAsDone: function(id) {
    adminDispatcher.handleEvent({
      actionType: quoteActions.flagAsDone,
      data: id
    });
  },

  reset: function() {
    adminDispatcher.handleEvent({
      actionType: quoteActions.reset
    });
  },

  validateField: function(fieldName, fieldValue) {
    adminDispatcher.handleEvent({
      actionType: quoteActions.validateField,
      data: {
        fieldName: fieldName,
        fieldValue: fieldValue
      }
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
  },

  fetchQuotes: function(quoteQueryParams) {
    adminDispatcher.handleEvent({
      actionType: quoteActions.fetchQuotes,
      data: quoteQueryParams
    });
  }
};

module.exports = actions;
