'use strict';

var $ = require('jquery');
var _ = require('lodash');
var ReactIntl = require('react-intl');
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var React = require('react');
var Actions = require('scripts/actions');
var QuotesCollection = require('../collections/quotes');
var collection = new QuotesCollection();
var BridgeQuoteItem = require('./bridge-quote-item.jsx');
var BridgeQuoteAcceptedQuote = require('./bridge-quote-accepted-quote.jsx');

var QuoteAccept = React.createClass({

  mixins: [IntlMixin],

  getDefaultProps: function() {
    return {
      wrapperClassName: ''
    };
  },

  propTypes: {
    bridgeQuoteUrl: React.PropTypes.string
  },

  messages: {
    prompt: 'costToSender',
    success: 'quoteSubmitSuccess',
    error: 'quoteSubmitError'
  },

  handleSuccess: function(acceptedQuoteModel) {
    var acceptedQuote = acceptedQuoteModel.toJSON();

    if (_.isFunction(this.props.onSuccessCb)) {
      this.props.onSuccessCb({
        acceptedQuoteAmount: acceptedQuote.wallet_payment.primary_amount.amount,
        acceptedQuoteCurrency: acceptedQuote.wallet_payment.primary_amount.currency,
        acceptedQuoteDebitAccount: acceptedQuote.source.account_number,
        acceptedQuoteCreditAccount: acceptedQuote.wallet_payment.destination_account_number
      });
    }

    this.setState({
      quoteAccepted: true
    });
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

  handleFail: function(model, error) {
    var errorMessage = this.getErrorMessage(error.responseText);

    this.setState({
      errorMessage: errorMessage
    });
  },

  submitQuote: function(id) {
    Actions.setAcceptQuoteUrl(this.props.bridgeQuoteUrl);
    Actions.submitQuote(id);

    this.setState({
      errorMessage: ''
    });
  },

  buildQuotes: function() {
    if (_.isEmpty(this.props.quotes)) {
      return false;
    }

    return _.map(this.props.quotes, quote => {
      var quoteData = quote.wallet_payment.primary_amount,
          id = quote.id;

      return (
        <BridgeQuoteItem
          key={id}
          id={id}
          quoteData={quoteData}
          handleClick={this.submitQuote}
          isDisabled={this.props.isDisabled}
        />
      );
    });
  },

  getInitialState: function() {
    return {
      acceptedQuote: '',
      quoteAccepted: false,
      errorMessage: ''
    };
  },

  componentDidMount: function() {
    collection.on('sync', this.handleSuccess);
    collection.on('error', this.handleFail);
  },

  componentWillUnmount: function() {
    collection.off();
  },

  componentWillReceiveProps: function(props) {
    if (props.quotes.length) {
      collection.set(props.quotes)
    }
  },

  alertErrorMessage: function() {
    if (_.isEmpty(this.state.errorMessage)) {
      return false;
    }

    return (
      <div className='alert alert-danger'>
        {this.state.errorMessage}
      </div>
    );
  },

  render: function() {
    var quotes = this.buildQuotes(),
        messages = <FormattedMessage message={this.getIntlMessage(this.messages.prompt)} />;

    return (
      <div className={this.props.wrapperClassName}>
        {
          (this.props.isActive || this.state.quoteAccepted) ?
            <div>
              <h4>{messages}</h4>
              <ul className='list-group'>
                {quotes}
              </ul>
              {this.alertErrorMessage()}
            </div>
            : false
        }
      </div>
    );
  }
});

module.exports = QuoteAccept;
