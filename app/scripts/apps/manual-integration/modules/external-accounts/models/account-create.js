'use strict';

var path = require('path');
var _ = require('lodash');
var $ = require('jquery');
var RippleName = require('ripple-name');
var Backbone = require('backbone');
var ValidationMixins = require('scripts/shared/mixins/models/validation-mixin');
var adminDispatcher = require('scripts/dispatchers/admin-dispatcher');
var appConfig = require('app-config.json');

Backbone.$ = $;

var Account = Backbone.Model.extend({
  defaults: {
    name: '',
    address: '', // federation address
    uid: '', // bank account number
    type: '', // gateway / customer (acct)
    data: ''
  },

  validationRules: {
    name: {
      validators: ['isString', 'minLength:1']
    },
    address: {
      validators: ['isRequired', 'isString', 'minLength:1']
    },
    uid: {
      validators: ['isString', 'minLength:1']
    },
    type: {
      validators: ['isRequired', 'isString', 'minLength:1']
    },
    data: {
      validators: ['isString', 'minLength:1']
    }
  },

  initialize: function() {
    _.bindAll(this);

    adminDispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {};

    handleAction.resetExternalAccountCreateForm = this.resetExternalAccountCreateForm;
    handleAction.createAccountAttempt = this.createAccountAttempt;
    handleAction.validateExternalAccountCreateFormField = this.validateExternalAccountCreateFormField;

    if (!_.isUndefined(handleAction[payload.actionType])) {
      handleAction[payload.actionType](payload.data);
    }
  },

  resetExternalAccountCreateForm: function() {
    this.clear().set(this.defaults);
  },

  createAccount: function() {
    this.save(null, {
      url: appConfig.baseUrl + path.join('/', 'v1/external_accounts'),
      contentType: 'application/json'
    });
  },

  validateExternalAccountCreateFormField: function(data) {
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

  createAccountAttempt: function(account) {
    this.set(account);

    if (this.isValid()) {
      this.createAccount();
    }
  }
});

//add validation mixin
_.extend(Account.prototype, ValidationMixins);

module.exports = Account;
