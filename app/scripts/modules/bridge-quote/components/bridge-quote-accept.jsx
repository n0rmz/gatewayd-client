"use strict";

var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var quoteActions = require('../actions');
var QuotesCollection = require('../collections/quotes');
var collection = new QuotesCollection();
var BridgeQuoteItem = require('./bridge-quote-item.jsx');
var BridgeQuoteAcceptedQuote = require('./bridge-quote-accepted-quote.jsx');

var QuoteAccept = React.createClass({

  getDefaultProps: function() {
    return {
      wrapperClassName: ''
    };
  },

  propTypes: {
    bridgeQuoteUrl: React.PropTypes.string
  },

  messages: {
    prompt: 'Please choose a quote',
    success: 'Quote submitted',
    error: 'Quoting service failed'
  },

  handleSuccess: function(model) {
    var submittedQuote = model.toJSON();

    if (_.isFunction(this.props.onSuccessCb)) {
      this.props.onSuccessCb({
        acceptedQuoteAmount: submittedQuote.wallet_payment.primary_amount.amount,
        acceptedQuoteCurrency: submittedQuote.wallet_payment.primary_amount.currency,
        acceptedQuoteDestinationAddress: submittedQuote.wallet_payment.destination
      });
    }

    this.setState({
      quoteAccepted: true
    });
  },

  getErrorMessage: function(responseText) {
    var errorMessage = '';

    if (responseText === 'Unauthorized') {
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
    quoteActions.setAcceptQuoteUrl(this.props.bridgeQuoteUrl);
    quoteActions.submitQuote(id);

    this.setState({
      errorMessage: ''
    });
  },

  buildQuotes: function() {
    if (_.isEmpty(this.props.quotes)) {
      return false;
    }

    var _this = this;

    return _.map(this.props.quotes, function(quote) {
      var quoteData = quote.wallet_payment.primary_amount,
          id = quote.id;

      return (
        <BridgeQuoteItem
          key={id}
          id={id}
          quoteData={quoteData}
          handleClick={_this.submitQuote}
          isDisabled={_this.props.isDisabled}
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
    collection.off('sync error');
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
      <div className="alert alert-danger">
        {this.state.errorMessage}
      </div>
    );
  },

  render: function() {
    var quotes = this.buildQuotes();

    return (
      <div className={this.props.wrapperClassName}>
        {
          (this.props.isActive || this.state.quoteAccepted) ?
            <div>
              <h4>{this.messages.prompt}</h4>
              <ul className="list-group">
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
