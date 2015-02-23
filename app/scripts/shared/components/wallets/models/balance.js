'use strict';

var _ = require('lodash');
var Backbone = require('backbone');
var ValidationMixins = require('scripts/shared/mixins/models/validation-mixin');
var adminDispatcher = require('scripts/dispatchers/admin-dispatcher');

var Balance = Backbone.Model.extend({
  defaults: {
    value: 0,
    currency: '',
    counterparty: ''
  },

  validationRules: {
    value: {
      validators: ['isRequired', 'isNumber']
    },
    currency: {
      validators: ['isRequired', 'isString', 'minLength:1']
    },
    counterparty: {
      validators: ['isString', 'minLength:1']
    }
  },

  initialize: function() {
    _.bindAll(this);

    adminDispatcher.register(this.dispatchCallback);
  },

  dispatchCallback: function(payload) {
    var handleAction = {};

    if (!_.isUndefined(handleAction[payload.actionType])) {
      handleAction[payload.actionType](payload.data);
    }
  }
});

//add validation mixin
_.extend(Balance.prototype, ValidationMixins);

module.exports = Balance;
