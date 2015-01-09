"use strict";

var adminDispatcher = require('../../dispatchers/admin-dispatcher');
var quoteActions = require('./config.json').actions;

var actions = {
  setQuotingUrl: function(newUrl) {
    adminDispatcher.handleEvent({
      actionType: quoteActions.setQuotingUrl,
      data: newUrl
    });
  },

  updateUrlWithParams: function(quoteQueryParams) {
    adminDispatcher.handleEvent({
      actionType: quoteActions.updateUrlWithParams,
      data: quoteQueryParams
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

  fetchQuotes: function(quoteQueryParams) {
    adminDispatcher.handleEvent({
      actionType: quoteActions.fetchQuotes,
      data: quoteQueryParams
    });
  }
};

module.exports = actions;
