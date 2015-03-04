'use strict';

var adminDispatcher = require('scripts/dispatchers/admin-dispatcher');

var Actions = {

  // external accounts

  resetExternalAccountCreateForm: function() {
    adminDispatcher.handleEvent({
      actionType: 'resetExternalAccountCreateForm'
    });
  },

  validateExternalAccountCreateFormField: function(fieldName, fieldValue) {
    adminDispatcher.handleEvent({
      actionType: 'validateExternalAccountCreateFormField',
      data: {
        fieldName: fieldName,
        fieldValue: fieldValue
      }
    });
  },

  createAccountAttempt: function(account) {
    adminDispatcher.handleEvent({
      actionType: 'createAccountAttempt',
      data: account
    });
  },

  createAccountComplete: function(account) {
    adminDispatcher.handleEvent({
      actionType: 'createAccountComplete',
      data: account
    });
  },

  fetchExternalAccounts: function() {
    adminDispatcher.handleEvent({
      actionType: 'fetchExternalAccounts'
    });
  },

  // external transactions

  flagExternalPaymentAsDone: function(id) {
    adminDispatcher.handleEvent({
      actionType: 'flagExternalPaymentAsDone',
      data: id
    });
  },

  flagExternalPaymentAsFailed: function(id) {
    adminDispatcher.handleEvent({
      actionType: 'flagExternalPaymentAsFailed',
      data: id
    });
  },

  flagExternalPaymentAsDoneWithEdits: function(updatedAttributes) {
    adminDispatcher.handleEvent({
      actionType: 'flagExternalPaymentAsDoneWithEdits',
      data: updatedAttributes
    });
  },

  flagExternalPaymentAsInvoicePaid: function(updatedAttributes) {
    adminDispatcher.handleEvent({
      actionType: 'flagExternalPaymentAsInvoicePaid',
      data: updatedAttributes
    });
  },

  populateForm: function(paymentInfo) {
    adminDispatcher.handleEvent({
      actionType: 'populateForm',
      data: paymentInfo
    });
  },

  resetExternalPaymentCreateForm: function() {
    adminDispatcher.handleEvent({
      actionType: 'resetExternalPaymentCreateForm'
    });
  },

  validateExternalPaymentCreateFormField: function(fieldName, fieldValue) {
    adminDispatcher.handleEvent({
      actionType: 'validateExternalPaymentCreateFormField',
      data: {
        fieldName: fieldName,
        fieldValue: fieldValue
      }
    });
  },

  sendExternalPaymentAttempt: function(payment) {
    adminDispatcher.handleEvent({
      actionType: 'sendExternalPaymentAttempt',
      data: payment
    });
  },

  sendExternalPaymentComplete: function(payment) {
    adminDispatcher.handleEvent({
      actionType: 'sendExternalPaymentComplete',
      data: payment
    });
  },

  fetchExternalTransactions: function() {
    adminDispatcher.handleEvent({
      actionType: 'fetchExternalTransactions'
    });
  },

  fetchNewExternalTransactions: function() {
    adminDispatcher.handleEvent({
      actionType: 'fetchNewExternalTransactions'
    });
  },

  // wallets

  fetchBalances: function() {
    adminDispatcher.dispatch({
      actionType: 'fetchBalances'
    });
  },

  // bridge quote

  setAcceptQuoteUrl: function(urlWithDomain) {
    adminDispatcher.handleEvent({
      actionType: 'setAcceptQuoteUrl',
      data: urlWithDomain
    });
  },

  submitQuote: function(quoteId) {
    adminDispatcher.handleEvent({
      actionType: 'submitQuote',
      data: quoteId
    });
  },

  // bridge quote get

  setQuotingUrl: function(newUrl) {
    adminDispatcher.handleEvent({
      actionType: 'setQuotingUrl',
      data: newUrl
    });
  },

  updateUrlWithParams: function(quoteQueryParams) {
    adminDispatcher.handleEvent({
      actionType: 'updateUrlWithParams',
      data: quoteQueryParams
    });
  },

  resetBridgeQuoteInquiryForm: function() {
    adminDispatcher.handleEvent({
      actionType: 'resetBridgeQuoteInquiryForm'
    });
  },

  validateBridgeQuoteInquiryFormField: function(fieldName, fieldValue) {
    adminDispatcher.handleEvent({
      actionType: 'validateBridgeQuoteInquiryFormField',
      data: {
        fieldName: fieldName,
        fieldValue: fieldValue
      }
    });
  },

  updateBridgeQuoteInquiryFormAttributeData: function(fieldName, fieldValue) {
    adminDispatcher.handleEvent({
      actionType: 'updateBridgeQuoteInquiryFormAttributeData',
      data: {
        fieldName: fieldName,
        fieldValue: fieldValue
      }
    });
  },

  fetchQuotes: function(quoteQueryParams) {
    adminDispatcher.handleEvent({
      actionType: 'fetchQuotes',
      data: quoteQueryParams
    });
  },

  // ripple address lookup

  setFederatedAddress: function(address) {
    adminDispatcher.handleEvent({
      actionType: 'setFederatedAddress',
      data: address
    });
  },

  resolveAddress: function() {
    adminDispatcher.handleEvent({
      actionType: 'resolveAddress'
    });
  },

  // ripple

  flagRipplePaymentAsDone: function(id) {
    adminDispatcher.handleEvent({
      actionType: 'flagRipplePaymentAsDone',
      data: id
    });
  },

  retryFailedPayment: function(id) {
    adminDispatcher.handleEvent({
      actionType: 'retryFailedPayment',
      data: id
    });
  },

  resetPaymentCreateForm: function() {
    adminDispatcher.handleEvent({
      actionType: 'resetPaymentCreateForm'
    });
  },

  validateRipplePaymentCreateFormField: function(fieldName, fieldValue) {
    adminDispatcher.handleEvent({
      actionType: 'validateRipplePaymentCreateFormField',
      data: {
        fieldName: fieldName,
        fieldValue: fieldValue
      }
    });
  },

  validateRipplePaymentCreateFormAddressField: function(address) {
    adminDispatcher.handleEvent({
      actionType: 'validateRipplePaymentCreateFormAddressField',
      data: address
    });
  },

  sendRipplePaymentAttempt: function(payment) {
    adminDispatcher.handleEvent({
      actionType: 'sendRipplePaymentAttempt',
      data: payment
    });
  },

  sendRipplePaymentComplete: function(payment) {
    adminDispatcher.handleEvent({
      actionType: 'sendRipplePaymentComplete',
      data: payment
    });
  },

  fetchNewRippleTransactions: function() {
    adminDispatcher.handleEvent({
      actionType: 'fetchNewRippleTransactions'
    });
  },

  fetchRippleTransactions: function() {
    adminDispatcher.handleEvent({
      actionType: 'fetchRippleTransactions'
    });
  }
};

module.exports = Actions;
