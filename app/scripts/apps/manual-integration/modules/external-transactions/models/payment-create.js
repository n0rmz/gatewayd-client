'use strict';

var path = require('path');
var _ = require('lodash');
var $ = require('jquery');
var RippleName = require('ripple-name');
var Backbone = require('backbone');

var reqlib = require('app-root-path').require;
var ValidationMixins = reqlib('/app/scripts/shared/mixins/models/validation-mixin');
var adminDispatcher = reqlib('/app/scripts/dispatchers/admin-dispatcher');
var appConfig = reqlib('/app/app-config.json');

Backbone.$ = $;

var Payment = Backbone.Model.extend({
  defaults: {
    source_account_id: 0,
    source_amount: 0.0,
    source_currency: '',
    destination_account_id: 0,
    destination_amount: 0.0,
    destination_currency: '',
    deposit: true, // always true
    external_account_id: 1, // why is this required?
    status: 'queued', // always starts off queued
    // ripple_transaction_id: 0,
    // uid: '',
    // data: '',
    invoice_id: '',
    memos: ''
  },

  validationRules: {
    source_account_id: {
      validators: ['isRequired', 'isNumber']
    },
    source_amount: {
      validators: ['isRequired', 'isNumber']
    },
    source_currency: {
      validators: ['isRequired', 'isString', 'minLength:1']
    },
    destination_account_id: {
      validators: ['isRequired', 'isNumber']
    },
    destination_amount: {
      validators: ['isRequired', 'isNumber']
    },
    destination_currency: {
      validators: ['isRequired', 'isString', 'minLength:1']
    },
    deposit: {
      validators: ['isRequired', 'isBoolean']
    },
    external_account_id: {
      validators: ['isRequired', 'isNumber']
    },
    status: {
      validators: ['isString', 'minLength:1']
    },
    ripple_transaction_id: {
      validators: ['isNumber']
    },
    uid: {
      validators: ['isString', 'minLength:1']
    },
    data: {
      validators: ['isString', 'minLength:1']
    },
    invoice_id: {
      validators: ['isString', 'minLength:1']
    },
    memos: {
      validators: ['isString', 'minLength:1']
    }
  },

  initialize: function() {
    _.bindAll(this);

    adminDispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {};

    handleAction.resetExternalPaymentCreateForm = this.resetExternalPaymentCreateForm;
    handleAction.populateForm = this.populateForm;
    handleAction.validateExternalPaymentCreateFormField = this.validateExternalPaymentCreateFormField;
    handleAction.sendExternalPaymentAttempt = this.sendExternalPaymentAttempt;
    handleAction.flagExternalPaymentAsFailed = this.flagExternalPaymentAsFailed;
    handleAction.flagExternalPaymentAsDoneWithEdits = this.flagExternalPaymentAsDoneWithEdits;
    handleAction.flagExternalPaymentAsInvoicePaid = this.flagExternalPaymentAsInvoicePaid;

    if (!_.isUndefined(handleAction[payload.actionType])) {
      handleAction[payload.actionType](payload.data);
    }
  },

  resetExternalPaymentCreateForm: function() {
    this.clear().set(this.defaults);
  },

  populateForm: function(paymentInfo) {
    this.set(paymentInfo);
  },

  sendPayment: function() {
    this.save(null, {
      url: appConfig.baseUrl + path.join('/', 'v1/external_transactions'),
      contentType: 'application/json'
    });
  },

  validateExternalPaymentCreateFormField: function(data) {
    var attributeValidation = this.attributeIsValid(data.fieldName, data.fieldValue);
    var updatedField = {};

    updatedField[data.fieldName] = data.fieldValue;

    this.set(updatedField);

    if (attributeValidation.result) {
      this.trigger('validationComplete', true, data.fieldName, '');
    } else {
      this.trigger('validationComplete', false, data.fieldName, attributeValidation.errorMessages);
    }
  },

  sendExternalPaymentAttempt: function(payment) {
    this.set(payment);

    if (this.isValid()) {
      this.sendPayment();
    }
  },

  updatePayment: function() {
    this.save(null, {
      url: appConfig.baseUrl + path.join(
        '/', 'v1/external_transactions', this.get('id').toString()),
      contentType: 'application/json'
    });
  },

  flagExternalPaymentAsFailed: function() {
    this.set({
      status: 'failed',
      source_amount: 0,
      destination_amount: 0
    });

    this.updatePayment();
  },

  flagExternalPaymentAsDoneWithEdits: function(updatedAttributes) {
    if (this.get('deposit')) {
      this.set(_.extend(updatedAttributes, {
        status: 'processed'
      }));
    } else {
      this.set(_.extend(updatedAttributes, {
        status: 'succeeded'
      }));
    }

    if (this.isValid()) {
      this.updatePayment();
    }
  },

  flagExternalPaymentAsInvoicePaid: function(updatedAttributes) {
    this.set(_.extend(updatedAttributes, {
      status: 'queued'
    }));

    if (this.isValid()) {
      this.updatePayment();
    }
  }
});

//add validation mixin
_.extend(Payment.prototype, ValidationMixins);

module.exports = new Payment();
