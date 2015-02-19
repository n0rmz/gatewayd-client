'use strict';

var Morearty = require('morearty');
var Reflux = require('reflux');
var Checkit = require('checkit');
console.log('Checkit.Validators', Checkit.Validators);
var ActionCreators = require('../actions/ActionCreators');

var WebfingerStore = Reflux.createStore({

  listenables: ActionCreators,

  rules: {
    destination_address: ['required', 'minLength:1'],
    destination_amount: ['required', 'isNumeric', 'greaterThan:0'],
    destination_currency: ['required', 'minLength:1']
  },

  init: function() {
    this.rootBinding = this.getMoreartyContext().getBinding();
    this.bridgeQuoteInquiryFormBinding = this.rootBinding.sub('bridgeQuoteInquiryForm');
  },

  onSetInput: function(attributeName, newValue) {
    var binding = this.bridgeQuoteInquiryFormBinding.sub(attributeName);

    binding
      .atomically()
      .set('value', newValue)
      .commit();
  },

  onValidateInput: function(attributeName, value) {
    var binding = this.bridgeQuoteInquiryFormBinding.sub(attributeName);

    Checkit.check(attributeName, value, this.rules[attributeName])
    .then((validated) => {
      console.log('VALIDATED!!!!!!', validated);

      binding
        .atomically()
        .set('bsStyle', 'success')
        .set('isValid', true)
        .commit();
    })
    .catch((error) => {
      console.log('ERROR!!!!!!!!', error.message);

      binding
        .atomically()
        .set('bsStyle', 'warning')
        .set('errorMessage', 'BAD')
        .set('isValid', false);
    });
  }
});

module.exports = WebfingerStore;


// "use strict";

// var _ = require('lodash');
// var $ = require('jquery');
// var RippleName = require('ripple-name');
// var Backbone = require('backbone');
// var ValidationMixins = require('../../../shared/helpers/validation_mixin');
// var adminDispatcher = require('../../../dispatchers/admin-dispatcher');
// var quoteConfigActions = require('../config.json').actions;

// Backbone.$ = $;

// var QuoteInquiryForm = Backbone.Model.extend({
//   defaults: {
//     destination_address: '',
//     destination_currency: '',
//     destination_amount: NaN
//   },

//   validationRules: {
//     destination_address: {
//       validators: ['isRequired', 'isString', 'minLength:1']
//     },
//     destination_currency: {
//       validators: ['isRequired', 'isString', 'minLength:3']
//     },
//     destination_amount: {
//       validators: ['isRequired', 'isNumeric']
//     }
//   },

//   initialize: function() {
//     _.bindAll(this);

//     adminDispatcher.register(this.dispatchCallback);
//   },

//   dispatchCallback: function(payload) {
//     var handleAction = {};

//     handleAction[quoteConfigActions.reset] = this.reset;
//     handleAction[quoteConfigActions.validateField] = this.validateField;
//     handleAction[quoteConfigActions.updateAttributeData] = this.updateAttributeData;

//     if (!_.isUndefined(handleAction[payload.actionType])) {
//       handleAction[payload.actionType](payload.data);
//     }
//   },

//   reset: function() {
//     this.clear().set(this.defaults);
//   },

//   validateField: function(data) {
//     var attributeValidation = this.attributeIsValid(data.fieldName, data.fieldValue);

//     if (attributeValidation.result) {
//       this.trigger('validationComplete', true, data.fieldName, '');
//     } else {
//       this.trigger('validationComplete', false, data.fieldName, attributeValidation.errorMessages);
//     }
//   },

//   updateAttributeData: function(data) {
//     this.set(data.fieldName, data.fieldValue);
//   }
// });

// //add validation mixin
// _.extend(QuoteInquiryForm.prototype, ValidationMixins);

// module.exports = new QuoteInquiryForm();
