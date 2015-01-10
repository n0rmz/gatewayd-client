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

  getSecret: function(key) {
    if (secrets[key]) {
      return secrets[key];
    }

    return false;
  },

  // TODO - complete this when accept endpoint is complete
  handleSuccess: function() {
    // continue to step 4
    console.log('success', arguments);

    // if (_.isFunction(this.props.onSuccessCb)) {
    //   this.props.onSuccessCb({
    //     acceptedQuote: ???.toJSON()
    //   });
    // }
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

  submitQuote: function(id) {
    console.log(arguments);
    var quoteToSubmit = _.where(this.props.quotes, {
      id: id
    })[0];

    var bridgePaymentsUrl = this.buildBridgePaymentsUrl(this.props.bridgeQuoteUrl);
    var credentials = this.getSecret('credentials');

    //todo: move this into the model logic
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

    // TODO - move this to handleSuccess when accept endpoint is complete
    if (_.isFunction(this.props.onSuccessCb)) {
      this.props.onSuccessCb({
        acceptedQuoteAmount: quoteToSubmit.wallet_payment.primary_amount.amount,
        acceptedQuoteCurrency: quoteToSubmit.wallet_payment.primary_amount.currency,
        acceptedQuoteDestinationAddress: quoteToSubmit.wallet_payment.destination
      });
    }

    this.setState({
      quoteAccepted: true
    });
    // end move
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
      quoteAccepted: false
    };
  },

  componentDidMount: function() {
    collection.on('sync', this.handleSuccess);
    collection.on('error', this.handleFail);
  },

  componentWillUnmount: function() {
    collection.off('sync error');
  },

  render: function() {
    var quotes = this.buildQuotes();

    return (
      <div className={this.props.wrapperClassName}>
        { (this.props.isActive || this.state.quoteAccepted) ?
          <div>
            <h4>{this.messages.prompt}</h4>
            <ul className="list-group">
              {quotes}
            </ul>
          </div>
          : false
        }
      </div>
    );
  }
});

module.exports = QuoteAccept;
