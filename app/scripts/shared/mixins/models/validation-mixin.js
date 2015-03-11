'use strict';

var _ = require('lodash');

var validationMixin = {

  //todo map error messages to object or external module
  //for localization
  validators: {
    isString: function(val) {
      return _.isString(val) || ('is not a string');
    },

    isNumber: function(val) {
      return (_.isNumber(val) && !_.isNaN(val)) || ('is not a number');
    },

    isNumeric: function(val) {
      return (_.isNumber(val * 1) && !_.isNaN(val * 1)) || ('is not numeric');
    },

    isBoolean: function(val) {
      return _.isBoolean(val) || ('is not a boolean');
    },

    isArray: function(val) {
      return _.isArray(val) || ('is not a boolean');
    },

    minLength: function(val, length) {
      var length = parseInt(length, 10);

      return (val.length >= length) || ('length should be greater than ' + (length - 1));
    },

    isObject: function(val) {
      return _.isObject(val) || ('is not an object');
    },

    isRequired: function(val) {
      if (_.isNumber(val) || _.isBoolean(val)) {
        return !(_.isUndefined(val)) || ('is required');
      }

      return !(_.isEmpty(val)) || ('is required');
    }
  },

  addValidator: function(newValidator) {
    if (_.isUndefined(newValidator)) {
      return false;
    }

    _.extend(this.validators, newValidator);
  },

  isValidator: function(key) {
    return _.isFunction(this.validators[key]);
  },

  testValid: function(val, attr, rule) {

    // ignore validation on empty/undefined attributes when attribute is not required
    var isRequired;

    if (_.indexOf(rule.validators, 'isRequired') > -1) {
      isRequired = true;
    }

    if (_.isNumber(val) || _.isBoolean(val)) {
      if (_.isUndefined(val) && !isRequired) {
        return null;
      }
    } else {
      if (_.isEmpty(val) && !isRequired) {
        return null;
      }
    }

    var errors = [];
    var _isValidator = this.isValidator;
    var _env = this;
    var _validators = this.validators;

    _.each(rule.validators, test => {
      if (errors.length) {
        return false;
      }

      var args = [],
          valMethod = '';

      //handle string or object
      if (_.isString(test)) {
        args = test.split(':');

        valMethod = args.shift();
      } else if (_.isObject(test)) {
        args = test.args;

        valMethod = test.name;
      }

      //add val to args
      args.unshift(val);

      //ensure validation method exists
      if (_isValidator(valMethod)) {
        var result = _validators[valMethod].apply(_env, args);

        //only push when false or string
        if (!result || _.isString(result)) {
          errors.push(result);
        }
      } else {
        console.warn('validation method does not exist: ' + (test.name || test));
        return null;
      }
    });

    //pass errors to validate
    if (errors.length) {
      return errors;
    }
  },

  attributeIsValid: function(attribute, value) {
    if (_.isUndefined(this.validationRules[attribute])) {
      return false;
    }

    var errors = this.testValid(value, attribute, this.validationRules[attribute]);

    if (_.isEmpty(errors)) {
      return {
        result: true,
        errorMessages: null
      };
    } else {
      return {
        result: false,
        errorMessages: errors
      };
    }
  },

  validate: function(data) {
    var errors = [];
    var _validationRules = this.validationRules;
    var _testValid = this.testValid;

    _.each(data, (val, key) => {
      var error = {},
          message;

      //check if it needs to be validated
      if (_validationRules[key]) {
        message = _testValid(val, key, _validationRules[key]);
      }

      if (message) {
        error[key] = message;
        errors.push(error);
      }

    });

    if (errors.length) {
      return errors;
    } else {
      return false;
    }
  }

};

module.exports = validationMixin;
