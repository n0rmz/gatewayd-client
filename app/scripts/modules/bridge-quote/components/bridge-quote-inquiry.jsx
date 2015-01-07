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
    disableForm: false,
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
  },

  // list of custom event unbindings and actions on unmount
  // used in componentWillUnmount mixin method
  handleAfterUnmount: function() {
    quoteActions.reset();
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
      disableForm: false,
      submitButtonLabel: 'Re-Submit Quote Request?',
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();

    // set hidden input field value in model
    quoteActions.updateAttributeData('source_address', this.props.federatedAddress);

    var quoteQueryParams = this.buildFormObject(this.refs);

    this.setState({
      disableForm: true,
      submitButtonLabel: 'Getting Quotes...',
    });

    if (this.model.isValid()) {
      console.log('quoteQueryParams', quoteQueryParams);
      quoteActions.fetchQuotes(quoteQueryParams);
    } else {
      this.handleSubmissionError();
    }
  },

  render: function() {
    var destination_address = this.state.destination_address;
    var destination_currency = this.state.destination_currency;
    var destination_amount = this.state.destination_amount;
    var source_address = this.state.source_address;

    return (
      <form onSubmit={this.handleSubmit}>
        <Input type="text" ref={destination_address.refName}
          label="Destination Address:"
          bsStyle={this.validationMap[destination_address.inputState]}
          disabled={this.state.disableForm}
          onBlur={this.validateField.bind(this, destination_address.refName)}
          onChange={this.handleChange.bind(this, destination_address.refName)}
          value={destination_address.value}
          autoFocus={true}
          hasFeedback
        />
        {this.errorMessageLabel(destination_address.errorMessage)}

        <Input type="text" ref={destination_amount.refName}
          label="Destination Amount:"
          bsStyle={this.validationMap[destination_amount.inputState]}
          disabled={this.state.disableForm}
          onBlur={this.validateField.bind(this, destination_amount.refName)}
          onChange={this.handleChange.bind(this, destination_amount.refName)}
          value={destination_amount.value}
          hasFeedback
        />
        {this.errorMessageLabel(destination_amount.errorMessage)}

        <Input type="tel" ref={destination_currency.refName}
          label="Destination Currency:"
          bsStyle={this.validationMap[destination_currency.inputState]}
          disabled={this.state.disableForm}
          onBlur={this.validateField.bind(this, destination_currency.refName)}
          onChange={this.handleChange.bind(this, destination_currency.refName)}
          value={destination_currency.value}
          hasFeedback
        />
        {this.errorMessageLabel(destination_currency.errorMessage)}

        <Input type="hidden" ref={source_address.refName}
          value={this.props.federatedAddress}
        />

        <h5><strong>Source Address:</strong></h5>
        <p>{this.props.federatedAddress}</p>
        <br />

        <Button
          className="pull-right"
          bsStyle="primary"
          bsSize="large"
          type="submit"
          disabled={this.state.disableForm || this.state.disableSubmitButton}
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
