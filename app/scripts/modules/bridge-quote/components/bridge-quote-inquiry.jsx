"use strict";

var _ = require('lodash');
var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var quoteActions = require('../actions');
var BridgeQuoteInquiryModel = require('../models/quote-inquiry');
var FormValidationMixin = require('../../../shared/mixins/components/form_validation_mixin');

var QuoteInquiryForm = React.createClass({
  mixins: [FormValidationMixin],

  model: BridgeQuoteInquiryModel,

  refNameTypeMap: {
    source_address: 'string',
    destination_address: 'string',
    destination_currency: 'string',
    destination_amount: 'number'
  },

  // used in getInitialState mixin method
  initialState: {
    submitButtonLabel: 'Get Quotes'
  },

  updateInputField: function(refName, value) {
    var updatedInput = _.extend(this.state[refName], {
      value: value
    });

    if (this.isMounted()) {
      this.setState(updatedInput);
    }
  },

  updateDestinationAddress: function(model, newAddress) {
    this.updateInputField('destination_address', newAddress);
  },

  updateDestinationCurrency: function(model, newCurrency) {
    this.updateInputField('destination_currency', newCurrency);
  },

  updateDestinationAmount: function(model, newAmount) {
    this.updateInputField('destination_amount', newAmount);
  },

  // list of custom event bindings and actions on mount
  // used in componentDidMount mixin method
  handleAfterMount: function() {
    this.model.on('change:destination_address', this.updateDestinationAddress);
    this.model.on('change:destination_currency', this.updateDestinationCurrency);
    this.model.on('change:destination_amount', this.updateDestinationAmount);
    this.model.on('error', this.handleError);
  },

  // list of custom event unbindings and actions on unmount
  // used in componentWillUnmount mixin method
  handleAfterUnmount: function() {
    this.model.off('change error');
    quoteActions.reset();
  },

  componentDidUpdate: function() {
    if (!this.props.isDisabled) {
      _.once(this.activateForm);
    }
  },

  //todo: this currently focuses. Should it toggle state of entire form?
  activateForm: function() {

    //oh my eeeeyyyyes are bleeding
    // this.refs.destination_address.getDOMNode().focus();
    this.refs.destination_address.refs.input.getDOMNode().focus();
  },

  //TODO use this to check if model is valid. Part of todo below
  handleError: function() {
  },

  handleSuccess: function() {
    console.log("success", arguments);

    if (_.isFunction(this.props.onSuccessCb)) {
      this.props.onSuccessCb({});
    }
  },

  // list of actions to invoke after form input changes
  // used in handleChange mixin method
  handleAfterChange: function(refName, fieldValue) {
    quoteActions.updateAttributeData(refName, fieldValue);
  },

  // list of actions to dispatch when validating field on blur
  // used in validateField mixin method
  handleValidations: function(refName, fieldValue) {
    quoteActions.validateField(refName, fieldValue);
  },

  // list of actions to dispatch after successful creation
  // used in dispatchCreateComplete mixin method
  handleAfterCreate: function(data) {},

  // on model sync error
  handleSubmissionError: function() {
    this.setState({
      submitButtonLabel: 'Re-Submit Quote Request?',
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();

    // set hidden input field value in model
    quoteActions.updateAttributeData('source_address', this.props.federatedAddress);

    var quoteQueryParams = this.buildFormObject(this.refs);

    this.setState({
      submitButtonLabel: 'Getting Quotes...',
    });

    if (this.model.isValid()) {
      quoteActions.setTemplateUrl(this.props.bridgeQuoteUrl);

      quoteActions.fetchQuotes(quoteQueryParams);
    } else {
      this.handleSubmissionError();
    }
  },

  render: function() {
    var isDisabled = (this.props.isDisabled === true) ? true : false;

    //todo: refs should not be state imo
    //state change triggers render. Why do we need to change a ref?
    var destination_address = this.state.destination_address;
    var destination_currency = this.state.destination_currency;
    var destination_amount = this.state.destination_amount;
    var source_address = this.state.source_address;

    return (
      <form onSubmit={this.handleSubmit} className={'flow-step' + (isDisabled ? ' disabled' : ' active')}>
        <Input
          type="text"
          ref="destination_address"
          label="Destination Address:"
          bsStyle={this.validationMap[destination_address.inputState]}
          disabled={isDisabled}
          onBlur={this.validateField.bind(this, 'destination_address')}
          onChange={this.handleChange.bind(this, 'destination_address')}
          value={destination_address.value}
          hasFeedback
        />
        {this.errorMessageLabel(destination_address.errorMessage)}

        <Input
          type="text"
          ref="destination_amount"
          label="Destination Amount:"
          bsStyle={this.validationMap[destination_amount.inputState]}
          disabled={isDisabled}
          onBlur={this.validateField.bind(this, 'destination_amount')}
          onChange={this.handleChange.bind(this, 'destination_amount')}
          value={destination_amount.value}
          hasFeedback
        />
        {this.errorMessageLabel(destination_amount.errorMessage)}

        <Input
          type="tel"
          ref="destination_currency"
          label="Destination Currency:"
          bsStyle={this.validationMap[destination_currency.inputState]}
          disabled={isDisabled}
          onBlur={this.validateField.bind(this, 'destination_currency')}
          onChange={this.handleChange.bind(this, 'destination_currency')}
          value={destination_currency.value}
          hasFeedback
        />
        {this.errorMessageLabel(destination_currency.errorMessage)}

        <Input
          type="hidden"
          ref="source_address"
          value={this.props.federatedAddress}
        />

        <h5><strong>Source Address:</strong></h5>
        <p>{this.props.federatedAddress}</p>
        <br />

        <Button
          bsStyle="primary"
          bsSize="large"
          type="submit"
          disabled={isDisabled}
          block
        >
          {this.state.submitButtonLabel}
        </Button>
        <br />
      </form>
    );
  }
});

module.exports = QuoteInquiryForm;
