'use strict';

var _ = require('lodash');
var Label = require('react-bootstrap').Label;

var FormValidationMixin = {
  validationMap: {
    valid: 'success',
    invalid: 'warning'
  },

  initializeRefs: function() {
    var formRefs = {};
    var keys = _.keys(this.refNameTypeMap);

    // models are not always props so this normalizes
    // the cases. There should be an api in the future
    // instead of this pattern
    this.model = this.model || this.props.model;

    if (!this.model) {
      return false;
    }

    _.each(keys, refName => {
      formRefs[refName] = {
        refName: refName,
        value: this.model.get(refName) || '',
        inputState: null,
        errorMessage: ''
      };
    });

    return formRefs;
  },

  getInitialState: function() {
    var formRefs = this.initializeRefs();

    return _.extend(this.initialState, formRefs);
  },

  componentDidMount: function() {
    this.model.on('invalid', this.showFailedValidationResult);
    this.model.on('validationComplete', this.handleValidationResult);
    this.model.on('sync', this.dispatchCreateComplete);
    this.model.on('error', this.handleSubmissionError);

    this.handleAfterMount();
  },

  componentWillUnmount: function() {
    this.model.off();

    this.handleAfterUnmount();
  },

  handleChange: function(refName, e) {
    var updatedInput = _.extend(this.state[refName], {
      value: e.target.value
    });

    this.setState(updatedInput);

    this.handleAfterChange(refName, e.target.value);
  },

  formatInput: function(rawInputRef, type) {
    var formattedInput = rawInputRef.getValue();

    if (!_.isString(formattedInput)) {
      console.log('this validation method requires typeOf string');
      return null;
    } else {
      formattedInput = formattedInput.trim();
    }

    if (!formattedInput) {
      return null;
    }

    return type === 'number' ? Number(formattedInput) : formattedInput;
  },

  buildFormObject: function(refKeys) {
    return _.mapValues(refKeys, (value, key) => {
      return this.formatInput(this.refs[key], this.refNameTypeMap[key]);
    });
  },

  setErrorMessage: function(refName, errorMessage) {
    var invalidField = _.extend(this.state[refName], {
      inputState: 'invalid',
      errorMessage: errorMessage
    });

    this.setState(invalidField);
  },

  // executed when invalid event is triggered from model
  showFailedValidationResult: function(model, validationError) {
    this.handleSubmissionError();

    _.each(validationError, attribute => {
      var refName = _.keys(attribute)[0];
      var firstErrorMessage = attribute[refName][0];

      this.setErrorMessage(refName, firstErrorMessage);
    });
  },

  handleValidationResult: function(isValid, refName, errorMessage) {
    if (isValid) {
      var validField = _.extend(this.state[refName], {
        inputState: 'valid',
        errorMessage: ''
      });

      this.setState(validField);
    } else {
      this.setErrorMessage(refName, errorMessage);
    }
  },

  clearFieldValidation: function(refName) {
    var clearFieldValidation = _.extend(this.state[refName], {
      inputState: null,
      errorMessage: ''
    });

    this.setState(clearFieldValidation);
  },

  validateField: function(refName) {
    var fieldValue = this.formatInput(this.refs[refName], this.refNameTypeMap[refName]);

    // remove any previous messages/styling before re-validating
    this.clearFieldValidation(refName);

    if (fieldValue !== null) {
      this.handleValidations(refName, fieldValue);
    }
  },

  dispatchCreateComplete: function(model, data) {
    this.handleAfterCreate(data);
  },

  requiredLabel: function(labelName) {
    return (
      <div>
        <Label bsStyle='info'>Required</Label> {labelName}
      </div>
    );
  },

  errorMessageLabel: function(errorMessage) {
    return (
      <Label bsStyle='warning'>{errorMessage}</Label>
    );
  }
};

module.exports = FormValidationMixin;
