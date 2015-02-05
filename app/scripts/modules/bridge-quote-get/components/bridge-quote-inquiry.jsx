"use strict";

var ReactIntl = require('react-intl');
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var _ = require('lodash');
var React = require('react');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var quoteActions = require('../actions');
var BridgeQuoteInquiryModel = require('../models/quote-inquiry');
var QuotesCollection = require('../collections/quotes');
var FormValidationMixin = require('../../../shared/mixins/components/form_validation_mixin');

var QuoteInquiryForm = React.createClass({
  getDefaultProps: function() {
    return {
      wrapperClassName: ''
    };
  },

  mixins: [IntlMixin, FormValidationMixin],

  model: BridgeQuoteInquiryModel,

  collection: new QuotesCollection(),

  refNameTypeMap: {
    source_address: 'string',
    destination_address: 'string',
    destination_currency: 'string',
    destination_amount: 'number'
  },

  // used in getInitialState mixin method
  initialState: {
    submitButtonLabel: 'quoteSubmitState1'
  },

  isFirstLoad: true,

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

    this.collection.on('sync', this.handleSuccess);
    this.collection.on('error', this.handleError);
  },

  // list of custom event unbindings and actions on unmount
  // used in componentWillUnmount mixin method
  handleAfterUnmount: function() {
    this.model.off('change error');
    this.collection.off('sync error');
    quoteActions.reset();
  },

  componentDidUpdate: function() {
    if (this.props.isActive) {
      this.activateForm();
    } else {

      // initialize first load if this module is disabled
      // just a flag to only autofocus on first load
      this.isFirstLoad = true;
    }
  },

  //todo: this currently focuses. Should it toggle state of entire form?
  activateForm: function() {
    if (this.isFirstLoad) {
      this.refs.destination_address.refs.input.getDOMNode().focus();
    }

    this.isFirstLoad = false;
  },

  getErrorMessage: function(responseText) {
    var errorMessage = '';

    if (_.isUndefined(responseText)) {
      errorMessage = 'Connection Refused';
    } else if (responseText === 'Unauthorized') {
      errorMessage = 'Unauthorized';
    } else {
      errorMessage = JSON.parse(responseText).errors[0];
    }

    return errorMessage;
  },

  //TODO use this to check if model is valid. Part of todo below
  handleError: function(collection, error) {
    var errorMessage = this.getErrorMessage(error.responseText);

    this.setState({
      formError: errorMessage,
      submitButtonLabel: 'quoteSubmitState4'
    });
  },

  handleSuccess: function(collection) {
    if (!collection.length) {
      this.handleError(collection, {
        error: {
          responseText: '{error: ["No quotes available"]}'
        }
      });

      return false;
    }

    if (_.isFunction(this.props.onSuccessCb)) {
      this.props.onSuccessCb({
        quotes: collection.toJSON()
      });
    }

    this.setState({
      submitButtonLabel: 'quoteSubmitState3',
      formError: ''
    });
  },

  // list of actions to invoke after form input changes
  // used in handleChange mixin method
  handleAfterChange: function(refName, fieldValue) {
    if (refName === 'destination_currency') {
      fieldValue = fieldValue.toUpperCase();
    }

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
  handleSubmissionError: function() {},

  // TODO - maybe append the domain after receiving the webfinger response?
  buildFederatedAddressWithDomain: function(federatedAddress, bridgeQuoteUrl) {
    return federatedAddress + '@' + bridgeQuoteUrl.split('/')[2];
  },

  handleSubmit: function(e) {
    e.preventDefault();

    if (!this.model.isValid()) {
      return;
    }

    // append domain to federated address provided in previous form
    var federatedAddressWithDomain =
      this.buildFederatedAddressWithDomain(this.props.federatedAddress, this.props.bridgeQuoteUrl);

    // build query params with complete federated address and model attributes
    var quoteQueryParams = _.extend({
      source_address: federatedAddressWithDomain
    }, this.model.toJSON());

    this.setState({
      submitButtonLabel: 'quoteSubmitState2',
    });

    quoteActions.setQuotingUrl(this.props.bridgeQuoteUrl);
    quoteActions.updateUrlWithParams(quoteQueryParams);
    quoteActions.fetchQuotes();
  },

  render: function() {
    var isActive = this.props.isActive,
        destination_address = this.state.destination_address,
        destination_currency = this.state.destination_currency,
        destination_amount = this.state.destination_amount,
        source_address = this.state.source_address,
        addressLabel, amountLabel, currencyLabel, getQuoteSubmit;

    addressLabel = <FormattedMessage message={this.getIntlMessage('destinationAddressLabel')} />;
    amountLabel = <FormattedMessage message={this.getIntlMessage('destinationAmountLabel')} />;
    currencyLabel = <FormattedMessage message={this.getIntlMessage('destinationCurrencyLabel')} />;
    getQuoteSubmit = <FormattedMessage message={this.getIntlMessage(this.state.submitButtonLabel)} />;

    return (
      <form onSubmit={this.handleSubmit} className={this.props.wrapperClassName}>
        <Input
          type="text"
          ref="destination_address"
          label={addressLabel}
          bsStyle={this.validationMap[destination_address.inputState]}
          disabled={!isActive}
          onBlur={this.validateField.bind(this, 'destination_address')}
          onChange={this.handleChange.bind(this, 'destination_address')}
          value={destination_address.value}
          hasFeedback
        />
        {this.errorMessageLabel(destination_address.errorMessage)}

        <div className="row">
          <div className="col-sm-6">
            <Input
              type="tel"
              ref="destination_amount"
              addonBefore="$"
              label={amountLabel}
              bsStyle={this.validationMap[destination_amount.inputState]}
              disabled={!isActive}
              onBlur={this.validateField.bind(this, 'destination_amount')}
              onChange={this.handleChange.bind(this, 'destination_amount')}
              value={destination_amount.value}
              hasFeedback
            />
            {this.errorMessageLabel(destination_amount.errorMessage)}
          </div>
          <div className="col-sm-6">
            <Input
              type="text"
              ref="destination_currency"
              label={currencyLabel}
              bsStyle={this.validationMap[destination_currency.inputState]}
              disabled={!isActive}
              onBlur={this.validateField.bind(this, 'destination_currency')}
              onChange={this.handleChange.bind(this, 'destination_currency')}
              value={destination_currency.value}
              hasFeedback
            />
            {this.errorMessageLabel(destination_currency.errorMessage)}
          </div>
        </div>
        <br/>
        <Button
          bsStyle="primary"
          bsSize="large"
          type="submit"
          disabled={!isActive}
          block
        >
          {getQuoteSubmit}
        </Button>
        {this.errorMessageLabel(this.state.formError)}
        <br />
      </form>
    );
  }
});

module.exports = QuoteInquiryForm;
