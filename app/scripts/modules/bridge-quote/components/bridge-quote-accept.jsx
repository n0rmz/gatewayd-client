"use strict";

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

  handleSuccess: function() {
    // continue to step 4
  },

  handleFail: function(errorMessage) {
    console.warn('error', errorMessage);
  },

  submitQuote: function(cid) {
    console.log(cid, 'was clicked');

    var quoteToSubmit = _.where(this.state.quotes, {
      cid: cid
    })[0];

    var acceptedQuote = (
      <div>
        <h4>Quote Submitted</h4>
        <ul className="list-group">
          <li className="list-group-item" key={_.uniqueId()}>
            <div>
              Amount: {quoteToSubmit.ripple.source_amount}
              Currency: {quoteToSubmit.ripple.source_currency}
            </div>
          </li>
        </ul>
      </div>
    );

    console.log('submitting', quoteToSubmit);

    this.setState({
      quoteAccepted: true,
      acceptedQuote: acceptedQuote
    });

    // extract base url from bridge quote url
    var parser = document.createElement('a');
    parser.href = this.props.bridgeQuoteUrl;

    console.log(parser.protocol + '//' + parser.host + '/v1/bridge_payments');

    $.ajax({
      type: 'POST',
      url: parser.protocol + '//' + parser.host + '/v1/bridge_payments',
      data: quoteToSubmit,
      done: this.handleSuccess,
      fail: this.handleFail
    });
  },

  buildQuotes: function(collection) {
    var models = collection.models;

    // TODO - is there another way to add an identifier to each quote?
    var quotes = _.map(models, function(quote) {
      console.log('inside the funky map', quote);

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
    collection.on('ready', this.buildQuotes);
  },

  componentWillUnmount: function() {
    collection.off('ready');
  },

  render: function() {
    var _this = this;

    var quotes = _.map(this.state.quotes, function(quote) {
      console.log('quote', quote);
      var quoteData = quote.ripple;

      return (
        <li className="list-group-item" key={_.uniqueId()}>
          <div>
            Amount: {quoteData.source_amount}
            Currency: {quoteData.source_currency}
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
