'use strict';

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
    address: '',
    amount: 0,
    currency: '',
    destinationTag: 0,
    source_tag: 0,
    invoice_id: '',
    memos: []
  },

  validationRules: {
    address: {
      validators: ['isRequired', 'isString', 'minLength:1']
    },
    unprocessed_address: {
      validators: ['isRequired', 'isString', 'minLength:1']
    },
    amount: {
      validators: ['isRequired', 'isNumber'] // decimal
    },
    currency: {
      validators: ['isRequired', 'isString', 'minLength:1']
    },
    destinationTag: {
      validators: ['isNumber']
    },
    source_tag: {
      validators: ['isNumber']
    },
    invoice_id: {
      validators: ['isString', 'minLength:1']
    },
    memos: {
      validators: ['isArray']
    },
    unprocessed_memos: {
      validators: ['isString', 'minLength:1']
    }
  },

  initialize: function() {
    _.bindAll(this);

    adminDispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {};

    handleAction.resetPaymentCreateForm = this.resetPaymentCreateForm;
    handleAction.sendRipplePaymentAttempt = this.sendRipplePaymentAttempt;
    handleAction.validateRipplePaymentCreateFormField = this.validateRipplePaymentCreateFormField;
    handleAction.validateRipplePaymentCreateFormAddressField = this.validateRipplePaymentCreateFormAddressField;

    if (!_.isUndefined(handleAction[payload.actionType])) {
      handleAction[payload.actionType](payload.data);
    }
  },

  resetPaymentCreateForm: function() {
    this.clear().set(this.defaults);
  },

  postPayment: function() {
    this.save(null, {
      url: appConfig.baseUrl + '/v1/payments/outgoing',
      contentType: 'application/json'
    });
  },

  createMemo: function(memoString) {
    var memos = [];
    var memo = {};

    memo.MemoData = memoString;

    memos.push(memo);

    return JSON.stringify(memos);
  },

  validateRipplePaymentCreateFormField: function(data) {
    var attributeValidation = this.attributeIsValid(data.fieldName, data.fieldValue);

    if (attributeValidation.result) {
      this.trigger('validationComplete', true, data.fieldName, '');

      if (data.fieldName === 'unprocessed_memos') {
        this.trigger('memosProcessed', this.createMemo(data.fieldValue));
      }
    } else {
      this.trigger('validationComplete', false, data.fieldName, attributeValidation.errorMessages);
    }
  },

  validateRipplePaymentCreateFormAddressField: function(address) {
    RippleName.lookup(address)
    .then(data => {
      if (data.exists) {
        this.validateRipplePaymentCreateFormField({
          fieldName: 'unprocessed_address',
          fieldValue: data.address
        });

        this.trigger('addressProcessed', data.address);
      } else {
        this.trigger('validationComplete', false, 'unprocessed_address', 'ripple name/address does not exist');
      }
    })
    .error(() => {
      this.trigger('validationComplete', false, 'unprocessed_address', 'ripple name lookup failed');
    });
  },

  sendRipplePaymentAttempt: function(payment) {
    if (!_.isEmpty(payment.memos)) {
      payment.memos = JSON.parse(payment.memos);
    }

    this.set(payment);

    if (this.isValid()) {
      this.postPayment();
    }
  }
});

//add validation mixin
_.extend(Payment.prototype, ValidationMixins);

module.exports = Payment;
