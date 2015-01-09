"use strict";

// todo: clean this up and modularize with variable file name/path
// handle secrets. Make npm module for this in the future
var secrets = require('../../../../../secrets');

var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var quoteActions = require('../actions');
var QuotesCollection = require('../collections/quotes');
var collection = new QuotesCollection();
var BridgeQuoteItem = require('./bridge-quote-item.jsx');
var BridgeQuoteAcceptedQuote = require('./bridge-quote-accepted-quote.jsx');

var QuoteAccept = React.createClass({
  propTypes: {
    bridgeQuoteUrl: React.PropTypes.string
  },

  messages: {
    disabled: '',
    prompt: 'Please choose a quote',
    success: 'Quote submitted',
    error: 'Quoting service failed'
  },

  selectMessage: function() {
    var selectedMessage = '';

    if (this.state.quoteAccepted) {
      selectedMessage = this.messages.success;
    } else if (this.props.isDisabled) {
      selectedMessage = this.messages.prompt;
    }

    return selectedMessage;
  },

  getSecret: function(key) {
    if (secrets[key]) {
      return secrets[key];
    }

    return false;
  },

  handleSuccess: function() {
    // continue to step 4
  },

  handleFail: function(errorMessage) {
    console.warn('error', errorMessage);
  },

  // extract base url from bridge quote url
  buildBridgePaymentsUrl: function(bridgeQuoteUrl) {
    var parser = document.createElement('a');

    parser.href = bridgeQuoteUrl;

    return parser.protocol + '//' + parser.host + '/v1/bridge_payments';
  },

  submitQuote: function(cid) {
    var quoteToSubmit = _.where(this.state.quotes, {
      cid: cid
    })[0];

    var bridgePaymentsUrl = this.buildBridgePaymentsUrl(this.props.bridgeQuoteUrl);
    var credentials = this.getSecret('credentials');

    this.setState({
      quoteAccepted: true,
      acceptedQuote: {
        amount: quoteToSubmit.wallet_payment.primary_amount.amount,
        currency: quoteToSubmit.wallet_payment.primary_amount.currency,
        destinationAddress: quoteToSubmit.wallet_payment.destination
      }
    });

    $.ajax({
      type: 'POST',
      url: bridgePaymentsUrl,
      data: quoteToSubmit,
      beforeSend: function (xhr) {
        xhr.setRequestHeader ('Authorization', credentials);
      },
      done: this.handleSuccess,
      fail: this.handleFail
    });
  },

  buildQuotes: function(collection) {
    var models = collection.models;

    // TODO - is there another way to add an identifier to each quote?
    var quotes = _.map(models, function(quote) {
      return _.extend(quote.toJSON(), {
        cid: quote.cid
      });
    });

    this.setState({
      quotes: quotes
    });
  },

  buildQuoteRenderables: function() {
    if (!this.state.quotes.length) {
      return [];
    }

    var _this = this;

    return _.map(this.state.quotes, function(quote) {
      var quoteData = quote.wallet_payment.primary_amount;
      var id = quote.cid;

      return (
        <BridgeQuoteItem
          key={id}
          id={id}
          quoteData={quoteData}
          handleClick={_this.submitQuote}
        />
      );
    });
  },

  getInitialState: function() {
    return {
      quotes: {},
      quoteAccepted: false,
      acceptedQuote: ''
    };
  },

  componentDidMount: function() {
    collection.on('sync', this.buildQuotes);
  },

  componentWillUnmount: function() {
    collection.off('sync');
  },

  componentWillReceiveProps: function(props) {
    if (props.quotes) {
      this.setState({
        quotes: props.quotes
      });
    }
  },

  render: function() {
    var quotes = this.buildQuoteRenderables();

    return (
      <div className={'flow-step' + (this.props.isDisabled ? ' disabled' : ' active')}>
        { !this.props.isDisabled ?
          <div>
            <h4>{this.messages.prompt}</h4>
            <ul className="list-group">
              {quotes}
            </ul>
          </div>
          : false
        }
        {
          this.state.quoteAccepted ?
            <BridgeQuoteAcceptedQuote
              amount={this.state.acceptedQuote.amount}
              currency={this.state.acceptedQuote.currency}
              destinationAddress={this.state.acceptedQuote.destinationAddress}
            />
            : false
        }
      </div>
    );
  }
});

module.exports = QuoteAccept;
