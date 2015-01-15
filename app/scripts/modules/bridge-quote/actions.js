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

  setAcceptQuoteUrl: function(urlWithDomain) {
    adminDispatcher.handleEvent({
      actionType: quoteActions.setAcceptQuoteUrl,
      data: urlWithDomain
    });
  },

  submitQuote: function(quoteId) {
    adminDispatcher.handleEvent({
      actionType: quoteActions.submitQuote,
      data: quoteId
    });
  }
};

module.exports = actions;
