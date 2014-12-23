"use strict";

var _ = require('lodash');
var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Label = require('react-bootstrap').Label;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var accountActions = require('../actions');

var AccountCreate = React.createClass({
  validationMap: {
    valid: 'success',
    invalid: 'warning'
  },

  refNameTypeMap: {
    name: 'string',
    address: 'string',
    uid: 'string',
    type: 'string',
    data: 'string'
  },

  handleClose: function() {
    this.props.onSubmitSuccess();
  },

  formatInput: function(rawInputRef, type) {
    var formattedInput = rawInputRef.getValue().trim();

    if (!formattedInput) {
      return null;
    }

    return type === 'number' ? formattedInput * 1 : formattedInput;
  },

  buildFormObject: function(refKeys) {
    var _this = this;

    return _.mapValues(refKeys, function(value, key) {
      return _this.formatInput(_this.refs[key], _this.refNameTypeMap[key]);
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var account = this.buildFormObject(this.refs);

    this.setState({
      disableForm: true,
      submitButtonLabel: 'Creating Account...',
    });

    accountActions.createAccountAttempt(account);
  },

  handleSubmissionError: function() {
    this.setState({
      disableForm: false,
      submitButtonLabel: 'Re-Submit Account Info?',
    });
  },

  setErrorMessage: function(fieldName, errorMessage) {
    var invalidField = {};

    invalidField[fieldName] = {
      inputState: 'invalid',
      errorMessage: errorMessage
    };

    this.setState(invalidField);
  },

  showFailedValidationResult: function(model, validationError) {
    var _this = this;

    this.handleSubmissionError();

    _.each(validationError, function(attribute) {
      var name = _.keys(attribute)[0];
      var firstErrorMessage = attribute[name][0];

      _this.setErrorMessage(name, firstErrorMessage);
    });
  },

  handleValidationResult: function(isValid, fieldName, errorMessage) {
    if (isValid) {
      var validField = {};

      validField[fieldName] = {inputState: 'valid'};

      this.setState(validField);
    } else {
      this.setErrorMessage(fieldName, errorMessage);
    }
  },

  validateField: function(fieldName) {
    var fieldValue = this.formatInput(this.refs[fieldName], this.refNameTypeMap[fieldName]);
    var clearFieldValidation = {};

    clearFieldValidation[fieldName] = {};

    this.setState(clearFieldValidation);

    if (fieldValue !== null) {
      accountActions.validateField(fieldName, fieldValue);
    }
  },

  dispatchCreateAccountComplete: function(model, data) {
    this.hideForm();

    accountActions.createAccountComplete(data.externalAccount);
  },

  hideForm: function() {
    this.props.onRequestHide();
  },

  getInitialState: function() {
    return {
      name: {},
      address: {},
      uid: {},
      type: {},
      data: {},
      disableForm: false,
      submitButtonLabel: 'Create Account',
    };
  },

  componentDidMount: function() {
    this.props.model.on('invalid', this.showFailedValidationResult);
    this.props.model.on('validationComplete', this.handleValidationResult);
    this.props.model.on('sync', this.dispatchCreateAccountComplete);
    this.props.model.on('error', this.handleSubmissionError);

    accountActions.reset();
  },

  componentWillUnmount: function() {
    this.props.model.off('invalid validationComplete sync error');
  },

  render: function() {
    var requiredLabel = function(labelName) {
      return (
        <div>
          <Label bsStyle="info">Required</Label> {labelName}
        </div>
      );
    };

    var errorMessageLabel = function(errorMessage) {
      return (
        <Label bsStyle="warning">{errorMessage}</Label>
      );
    };

    return (
      <Modal
        title="Create Account"
        backdrop={true}
        onRequestHide={this.hideForm}
        animation={false}
      >
        <div className="modal-body">
          <form onSubmit={this.handleSubmit}>
            <Input type="text" ref="name"
              label="Name:"
              bsStyle={this.validationMap[this.state.name.inputState]}
              disabled={this.state.disableForm}
              onBlur={this.validateField.bind(this, 'name')}
              hasFeedback
              autofocus={true}
            />
            {errorMessageLabel(this.state.name.errorMessage)}

            <Input type="text" ref="address"
              label={requiredLabel("Address: ")}
              bsStyle={this.validationMap[this.state.address.inputState]}
              disabled={this.state.disableForm}
              onBlur={this.validateField.bind(this, 'address')}
              hasFeedback
            />
            {errorMessageLabel(this.state.address.errorMessage)}

            <Input type="text" ref="uid"
              label="Unique Id:"
              bsStyle={this.validationMap[this.state.uid.inputState]}
              disabled={this.state.disableForm}
              onBlur={this.validateField.bind(this, 'uid')}
              hasFeedback
            />
            {errorMessageLabel(this.state.uid.errorMessage)}

            <Input type="select" ref="type"
              label={requiredLabel("Type: ")}
              bsStyle={this.validationMap[this.state.type.inputState]}
              disabled={this.state.disableForm}
              onBlur={this.validateField.bind(this, 'type')}
              hasFeedback
              multiple
            >
              <option value="customer">Customer</option>
              <option value="gateway">Gateway</option>
            </Input>
            {errorMessageLabel(this.state.type.errorMessage)}

            <Input type="text" ref="data"
              label="Data:"
              bsStyle={this.validationMap[this.state.data.inputState]}
              disabled={this.state.disableForm}
              onBlur={this.validateField.bind(this, 'data')}
              hasFeedback
            />
            {errorMessageLabel(this.state.data.errorMessage)}

            <Button className="pull-right" bsStyle="primary" bsSize="large" type="submit"
              disabled={this.state.disableForm || this.state.disableSubmitButton}
              block>
              {this.state.submitButtonLabel}
            </Button>
          </form>
        </div>
      </Modal>
    );
  }
});

module.exports = AccountCreate;
