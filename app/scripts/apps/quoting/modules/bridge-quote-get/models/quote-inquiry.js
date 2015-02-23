'use strict';

var _ = require('lodash');
var $ = require('jquery');
var RippleName = require('ripple-name');
var Backbone = require('backbone');
var ValidationMixins = require('scripts/shared/mixins/models/validation-mixin');
var adminDispatcher = require('scripts/dispatchers/admin-dispatcher');

Backbone.$ = $;

var QuoteInquiryForm = Backbone.Model.extend({
  defaults: {
    destination_address: '',
    destination_currency: '',
    destination_amount: NaN
  },

  validationRules: {
    destination_address: {
      validators: ['isRequired', 'isString', 'minLength:1']
    },
    destination_currency: {
      validators: ['isRequired', 'isString', 'minLength:3']
    },
    destination_amount: {
      validators: ['isRequired', 'isNumeric']
    }
  },

  initialize: function() {
    _.bindAll(this);

    adminDispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {};

    handleAction.resetBridgeQuoteInquiryForm = this.resetBridgeQuoteInquiryForm;
    handleAction.validateBridgeQuoteInquiryFormField = this.validateBridgeQuoteInquiryFormField;
    handleAction.updateBridgeQuoteInquiryFormAttributeData = this.updateBridgeQuoteInquiryFormAttributeData;

    if (!_.isUndefined(handleAction[payload.actionType])) {
      handleAction[payload.actionType](payload.data);
    }
  },

  resetBridgeQuoteInquiryForm: function() {
    this.clear().set(this.defaults);
  },

  validateBridgeQuoteInquiryFormField: function(data) {
    var attributeValidation = this.attributeIsValid(data.fieldName, data.fieldValue);

    if (attributeValidation.result) {
      this.trigger('validationComplete', true, data.fieldName, '');
    } else {
      this.trigger('validationComplete', false, data.fieldName, attributeValidation.errorMessages);
    }
  },

  updateBridgeQuoteInquiryFormAttributeData: function(data) {
    this.set(data.fieldName, data.fieldValue);
  }
});

//add validation mixin
_.extend(QuoteInquiryForm.prototype, ValidationMixins);

module.exports = new QuoteInquiryForm();
