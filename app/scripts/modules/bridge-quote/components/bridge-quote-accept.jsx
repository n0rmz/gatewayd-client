"use strict";

// todo: clean this up and modularize with variable file name/path
// handle secrets. Make npm module for this in the future

var secrets = require('../../../../../secrets.json');

// getSecret is a method on this component below
// end secrets

var CryptoJS = require('crypto-js');
var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var Button = require('react-bootstrap').Button;
var quoteActions = require('../actions');
var QuotesCollection = require('../collections/quotes');
var collection = new QuotesCollection();


var QuoteAccept = React.createClass({
  propTypes: {
    model: React.PropTypes.object
  },

  getSecret: function(key) {
    if (secrets[key]) {
      return secrets[key];
    }

    return false;
  },

  createCredentials: function(name, sessionKey) {
    var encodedString = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(name + ':' + sessionKey));

    return 'Basic ' + encodedString;
  },

  handleSuccess: function() {
    // continue to step 4
  },

  handleFail: function(errorMessage) {
    console.warn('error', errorMessage);
  },

  // extract base url from bridge quote url
  buildBridgePaymentsUrl: function(bridgeQuoteUrl) {
    console.log('bridgeQuoteUrl', bridgeQuoteUrl);
    var parser = document.createElement('a');

    parser.href = bridgeQuoteUrl;

    console.log('parser', parser.protocol + '//' + parser.host + '/v1/bridge_payments');

    return parser.protocol + '//' + parser.host + '/v1/bridge_payments';
  },

  submitQuote: function(cid) {
    var quoteToSubmit = _.where(this.state.quotes, {
      cid: cid
    })[0];

    var bridgePaymentsUrl = this.buildBridgePaymentsUrl(this.props.bridgeQuoteUrl);
    var credentials = this.createCredentials(this.getSecret('user'), this.getSecret('key'));

    // display this chosen quote
    var acceptedQuote = (
      <div>
        <h4>Quote Submitted</h4>
        <ul className="list-group">
          <li className="list-group-item" key={_.uniqueId()}>
            <div>
              Amount: {quoteToSubmit.wallet_payment.primary_amount.amount}
              Currency: {quoteToSubmit.wallet_payment.primary_amount.currency}
            </div>
          </li>
        </ul>
      </div>
    );

    this.setState({
      quoteAccepted: true,
      acceptedQuote: acceptedQuote
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

  render: function() {
    var _this = this;

    var quotes = _.map(this.state.quotes, function(quote) {
      var quoteData = quote.wallet_payment.primary_amount;

      return (
        <li className="list-group-item" key={_.uniqueId()}>
          <div>
            Amount: {quoteData.amount}
            Currency: {quoteData.currency}
            <Button
              className="pull-right"
              bsStyle="info"
              onClick={_this.submitQuote.bind(this, quote.cid)}
            >
              Accept
            </Button>
          </div>
        </li>
      );
    });

    var prompt = (
      <div>
        <h4>Please choose a quote to accept:</h4>
        <ul className="list-group">
          {quotes}
        </ul>
      </div>
    );

    return (
      <div>
        { this.state.quoteAccepted ? this.state.acceptedQuote : prompt }
      </div>
    );
  }
});

module.exports = QuoteAccept;
