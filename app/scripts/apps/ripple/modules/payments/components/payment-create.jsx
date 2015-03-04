'use strict';

var _ = require('lodash');
var ReactIntl = require('react-intl');
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Label = require('react-bootstrap').Label;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var Actions = require('scripts/actions');

var PaymentCreate = React.createClass({

  mixins: [IntlMixin],

  validationMap: {
    valid: 'success',
    invalid: 'warning'
  },

  refNameTypeMap: {
    address: 'string',
    unprocessed_address: 'string',
    amount: 'number',
    currency: 'string',
    destinationTag: 'number',
    source_tag: 'number',
    invoice_id: 'string',
    unprocessed_memos: 'string'
  },

  getInitialState: function() {
    return {
      addressValue: '',
      memosValue: '',
      unprocessed_address: {},
      amount: {},
      currency: {},
      currencyVal: '',
      destinationTag: {},
      source_tag: {},
      invoice_id: {},
      unprocessed_memos: {},
      disableForm: false,
      submitButtonLabel: 'sendSubmitSend'
    };
  },

  handleClose: function() {
    this.props.onSubmitSuccess();
  },

  formatInput: function(rawInputRef, type) {
    var formattedInput = rawInputRef.getValue().trim();

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

  handleSubmit: function(e) {
    e.preventDefault();

    var payment = this.buildFormObject(this.refs);

    this.setState({
      disableForm: true,
      submitButtonLabel: 'sendSubmitSending'
    });

    Actions.sendRipplePaymentAttempt(payment);
  },

  handleSubmissionError: function() {
    this.setState({
      disableForm: false,
      submitButtonLabel: 'sendSubmitRetry'
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
    this.handleSubmissionError();

    _.each(validationError, attribute => {
      var name = _.keys(attribute)[0];
      var firstErrorMessage = attribute[name][0];

      this.setErrorMessage(name, firstErrorMessage);
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

    if (fieldName === 'unprocessed_address') {
      this.setState({
        disableAddressField: false,
        disableSubmitButton: false
      });
    }
  },

  validateField: function(fieldName) {
    var fieldValue = this.formatInput(this.refs[fieldName], this.refNameTypeMap[fieldName]);
    var clearFieldValidation = {};

    clearFieldValidation[fieldName] = {};

    this.setState(clearFieldValidation);

    if (fieldValue !== null) {
      Actions.validateRipplePaymentCreateFormField(fieldName, fieldValue);
    }
  },

  validateAddress: function() {
    var addressFieldValue = this.formatInput(this.refs.unprocessed_address, this.refNameTypeMap.unprocessed_address);

    this.setState({
      unprocessed_address: {}
    });

    if (addressFieldValue !== null) {
      this.setState({
        disableAddressField: true,
        disableSubmitButton: true
      });

      Actions.validateRipplePaymentCreateFormAddressField(addressFieldValue);
    }
  },

  handleAddressProcessed: function(newAddressValue) {
    this.setState({
      addressValue: newAddressValue
    });
  },

  handleMemosProcessed: function(newMemosValue) {
    this.setState({
      memosValue: newMemosValue
    });
  },

  dispatchSendRipplePaymentComplete: function(model, data) {
    this.hideForm();

    Actions.sendRipplePaymentComplete(data.payment);
  },

  hideForm: function() {
    this.props.onRequestHide();
  },

  componentDidMount: function() {
    this.props.model.on('invalid', this.showFailedValidationResult);
    this.props.model.on('validationComplete', this.handleValidationResult);
    this.props.model.on('sync', this.dispatchSendRipplePaymentComplete);
    this.props.model.on('error', this.handleSubmissionError);
    this.props.model.on('addressProcessed', this.handleAddressProcessed);
    this.props.model.on('memosProcessed', this.handleMemosProcessed);

    Actions.resetPaymentCreateForm();
  },

  componentWillUnmount: function() {
    this.props.model.off();
  },

  getLabel: function(key, type) {
    if (!key) {
      return false;
    }

    if (type === 'required') {
      return (
        <div>
          <Label bsStyle='info'>
            <FormattedMessage message={this.getIntlMessage('sendLabelRequired')} />
          </Label>&nbsp;
          <FormattedMessage message={this.getIntlMessage(key)} />
        </div>
      );
    } else {
      return (
        <FormattedMessage message={this.getIntlMessage(key)} />
      );
    }
  },

  //todo: when we localize error strings, map them here
  getMessage: function(message, type) {
    type = type || 'info';

    return (
      <Label bsStyle={type}>{message}</Label>
    );
  },

  handleCurrencyType: function(e) {
    this.setState({currencyVal: (e.target.value).toUpperCase()});
  },

  render: function() {
    return (
      <Modal
        title='Send Payment'
        backdrop={true}
        onRequestHide={this.hideForm}
        animation={false}
      >
        <div className='modal-body'>
          <form onSubmit={this.handleSubmit}>
            <Input type='text' ref='unprocessed_address'
              label={this.getLabel('sendLabelAddress', 'required')}
              bsStyle={this.validationMap[this.state.unprocessed_address.inputState]}
              disabled={this.state.disableForm || this.state.disableAddressField}
              onBlur={this.validateAddress.bind(this, false)}
              hasFeedback
              autoFocus={true}
            />
            {this.getMessage(this.state.unprocessed_address.errorMessage, 'warning')}
            <Input type='hidden' ref='address' value={this.state.addressValue} />
            <Row>
              <Col xs={6}>
                <Input type='tel' ref='amount'
                  label={this.getLabel('sendLabelAmount', 'required')}
                  bsStyle={this.validationMap[this.state.amount.inputState]}
                  disabled={this.state.disableForm} onBlur={this.validateField.bind(this, 'amount')}
                  hasFeedback
                />
                {this.getMessage(this.state.amount.errorMessage, 'warning')}
              </Col>
              <Col xs={6}>
                <Input type='text' ref='currency'
                  label={this.getLabel('sendLabelCurrency', 'required')}
                  bsStyle={this.validationMap[this.state.currency.inputState]}
                  disabled={this.state.disableForm}
                  onChange={this.handleCurrencyType}
                  value={this.state.currencyVal}
                  onBlur={this.validateField.bind(this, 'currency')}
                  hasFeedback
                />
                {this.getMessage(this.state.currency.errorMessage, 'warning')}
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Input type='tel' ref='destinationTag'
                  label={this.getLabel('sendLabelDestinationTag')}
                  bsStyle={this.validationMap[this.state.destinationTag.inputState]}
                  disabled={this.state.disableForm} onBlur={this.validateField.bind(this, 'destinationTag')}
                  hasFeedback
                />
                {this.getMessage(this.state.destinationTag.errorMessage, 'warning')}
              </Col>
              <Col xs={6}>
                <Input type='tel' ref='source_tag'
                  label={this.getLabel('sendLabelSourceTag')}
                  bsStyle={this.validationMap[this.state.source_tag.inputState]}
                  disabled={this.state.disableForm} onBlur={this.validateField.bind(this, 'source_tag')}
                  hasFeedback
                />
                {this.getMessage(this.state.source_tag.errorMessage, 'warning')}
              </Col>
            </Row>
            <Input type='text' ref='invoice_id'
              label={this.getLabel('sendLabelInvoiceId')}
              bsStyle={this.validationMap[this.state.invoice_id.inputState]}
              disabled={this.state.disableForm} onBlur={this.validateField.bind(this, 'invoice_id')}
              hasFeedback
            />
            {this.getMessage(this.state.invoice_id.errorMessage, 'warning')}
            <Input type='textarea' ref='unprocessed_memos'
              label={this.getLabel('sendLabelMemos')}
              bsStyle={this.validationMap[this.state.unprocessed_memos.inputState]}
              disabled={this.state.disableForm} onBlur={this.validateField.bind(this, 'unprocessed_memos')}
              hasFeedback
            />
            {this.getMessage(this.state.unprocessed_memos.errorMessage, 'warning')}
            <Input type='hidden' ref='memos' value={this.state.memosValue} />
            <Button className='pull-right' bsStyle='primary' bsSize='large' type='submit'
              disabled={this.state.disableForm || this.state.disableSubmitButton}
              block>
              <FormattedMessage
                message={this.getIntlMessage(this.state.submitButtonLabel)}
              />
            </Button>
          </form>
        </div>
      </Modal>
    );
  }
});

module.exports = PaymentCreate;
