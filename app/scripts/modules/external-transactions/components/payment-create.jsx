"use strict";

var _ = require('lodash');
var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Label = require('react-bootstrap').Label;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var moduleActions = require('../actions');

var PaymentCreate = React.createClass({
  validationMap: {
    valid: 'success',
    invalid: 'warning'
  },

  refNameTypeMap: {
    source_account_id: 'number',
    source_amount: 'number',
    source_currency: 'string',
    destination_account_id: 'number',
    destination_amount: 'number',
    destination_currency: 'string',
    invoice_id: 'string',
    memos: 'string'
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

    var payment = this.buildFormObject(this.refs);

    this.setState({
      disableForm: true,
      submitButtonLabel: 'Sending Payment...',
    });

    moduleActions.sendPaymentAttempt(payment);
  },

  handleSubmissionError: function() {
    this.setState({
      disableForm: false,
      submitButtonLabel: 'Re-Submit Payment?',
    });
  },

  setErrorMessage: function(fieldName, errorMessage) {
    var invalidField = {};

    invalidField[fieldName] = {
      isValid: 'invalid',
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

      validField[fieldName] = {isValid: 'valid'};

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
      moduleActions.validateField(fieldName, fieldValue);
    }
  },

  dispatchSendPaymentComplete: function(model, data) {
    this.hideForm();

    moduleActions.sendPaymentComplete(data.externalTransaction);
  },

  hideForm: function() {
    this.props.onRequestHide();
  },

  getInitialState: function() {
    return {
      source_account_id: {},
      source_amount: {},
      source_currency: {},
      destination_account_id: {},
      destination_amount: {},
      destination_currency: {},
      invoice_id: {},
      memos: {},
      disableForm: false,
      submitButtonLabel: 'Send Payment',
    };
  },

  componentDidMount: function() {
    this.props.model.on('invalid', this.showFailedValidationResult);
    this.props.model.on('validationComplete', this.handleValidationResult);
    this.props.model.on('sync', this.dispatchSendPaymentComplete);
    this.props.model.on('error', this.handleSubmissionError);

    moduleActions.reset();
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
        title="Add a Deposit"
        backdrop={true}
        onRequestHide={this.hideForm}
        animation={false}
      >
        <div className="modal-body">
          <form onSubmit={this.handleSubmit}>
            <Row>
              <Col xs={4}>
                <Input type="text" ref="source_account_id"
                  label="Source Id:"
                  bsStyle={this.validationMap[this.state.source_account_id.isValid]}
                  disabled={this.state.disableForm}
                  onBlur={this.validateField.bind(this, 'source_account_id')}
                  hasFeedback
                  autofocus={true}
                />
                {errorMessageLabel(this.state.source_account_id.errorMessage)}
              </Col>
              <Col xs={4}>
                <Input type="text" ref="source_amount"
                  label="Amount:"
                  bsStyle={this.validationMap[this.state.source_amount.isValid]}
                  disabled={this.state.disableForm}
                  onBlur={this.validateField.bind(this, 'source_amount')}
                  hasFeedback
                  autofocus={true}
                />
                {errorMessageLabel(this.state.source_amount.errorMessage)}
              </Col>
              <Col xs={4}>
                <Input type="text" ref="source_currency"
                  label="Currency:"
                  bsStyle={this.validationMap[this.state.source_currency.isValid]}
                  disabled={this.state.disableForm}
                  onBlur={this.validateField.bind(this, 'source_currency')}
                  hasFeedback
                  autofocus={true}
                />
                {errorMessageLabel(this.state.source_currency.errorMessage)}
              </Col>
            </Row>
            <Row>
              <Col xs={4}>
                <Input type="text" ref="destination_account_id"
                  label="Destination Id:"
                  bsStyle={this.validationMap[this.state.destination_account_id.isValid]}
                  disabled={this.state.disableForm}
                  onBlur={this.validateField.bind(this, 'destination_account_id')}
                  hasFeedback
                  autofocus={true}
                />
                {errorMessageLabel(this.state.destination_account_id.errorMessage)}
              </Col>
              <Col xs={4}>
                <Input type="text" ref="destination_amount"
                  label="Amount:"
                  bsStyle={this.validationMap[this.state.destination_amount.isValid]}
                  disabled={this.state.disableForm}
                  onBlur={this.validateField.bind(this, 'destination_amount')}
                  hasFeedback
                  autofocus={true}
                />
                {errorMessageLabel(this.state.destination_amount.errorMessage)}
              </Col>
              <Col xs={4}>
                <Input type="text" ref="destination_currency"
                  label="Currency:"
                  bsStyle={this.validationMap[this.state.destination_currency.isValid]}
                  disabled={this.state.disableForm}
                  onBlur={this.validateField.bind(this, 'destination_currency')}
                  hasFeedback
                  autofocus={true}
                />
                {errorMessageLabel(this.state.destination_currency.errorMessage)}
              </Col>
            </Row>

            <Input type="text" ref="invoice_id"
              label="Invoice Id:"
              bsStyle={this.validationMap[this.state.invoice_id.isValid]}
              disabled={this.state.disableForm}
              onBlur={this.validateField.bind(this, 'invoice_id')}
              hasFeedback
              autofocus={true}
            />
            {errorMessageLabel(this.state.invoice_id.errorMessage)}

            <Input type="text" ref="memos"
              label="Memos:"
              bsStyle={this.validationMap[this.state.memos.isValid]}
              disabled={this.state.disableForm}
              onBlur={this.validateField.bind(this, 'memos')}
              hasFeedback
              autofocus={true}
            />
            {errorMessageLabel(this.state.memos.errorMessage)}

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

module.exports = PaymentCreate;
