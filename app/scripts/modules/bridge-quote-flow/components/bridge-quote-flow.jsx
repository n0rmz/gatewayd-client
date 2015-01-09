"use strict";

var React = require('react');
var path = require('path');
var Button = require('react-bootstrap').Button;
var RippleAddressLookup = require('../../ripple-address-lookup/components/ripple-address-lookup.jsx');
var BridgeQuoteInquiry = require('../../bridge-quote-get/components/bridge-quote-inquiry.jsx');
var BridgeQuoteAccept = require('../../bridge-quote/components/bridge-quote-accept.jsx');
var BridgeQuoteAcceptedQuote = require('../../bridge-quote/components/bridge-quote-accepted-quote.jsx');

var Payment = React.createClass({

  //todo - make a real state machine mixin later. Let's hack now
  //for expedience
  getInitialState: function() {
    return {
      currentStep: 1,
      federatedAddress: '',
      bridgeQuoteUrl: '',
      quotes: {},
      acceptedQuoteAmount: null,
      acceptedQuoteCurrency: '',
      acceptedQuoteDestinationAddress: ''
    };
  },

  incrementStep: function() {
    this.setState({
      currentStep: (this.state.currentStep + 1)
    });
    console.log(this.state.currentStep);
  },

  completeStep1: function(data) {
    console.log('step 1 completed', arguments);
    this.setState(data);
    this.incrementStep();
  },

  completeStep2: function(data) {
    console.log('step 2 completed', arguments);
    this.setState(data);
    this.incrementStep();
  },

  completeStep3: function(data) {
    console.log('step 3 completed', arguments);
    this.setState(data);
    this.incrementStep();
  },

  resetForm: function() {
    location.reload();
  },

  render: function() {

    return (
      <div className="">
        <h3>Get quote to send a payment
          <Button bsStyle="warning" className="pull-right" onClick={this.resetForm}>Cancel and Start Over</Button>
        </h3>
        <RippleAddressLookup
          isDisabled={(this.state.currentStep !== 1) ? true : false}
          onSuccessCb={this.completeStep1}
          label="Who is the sender?"
          id="ripple-address-lookup"
          placeholder="Enter a federated address"
        />
        <BridgeQuoteInquiry
          isDisabled={(this.state.currentStep !== 2) ? true : false}
          onSuccessCb={this.completeStep2}
          federatedAddress={this.state.federatedAddress}
          bridgeQuoteUrl={this.state.bridgeQuoteUrl}
        />
        <BridgeQuoteAccept
          isDisabled={(this.state.currentStep !== 3) ? true : false}
          onSuccessCb={this.completeStep3}
          bridgeQuoteUrl={this.state.bridgeQuoteUrl}
          quotes={this.state.quotes}
        />
        <BridgeQuoteAcceptedQuote
          isDisabled={(this.state.currentStep !== 4) ? true: false}
          amount={this.state.acceptedQuoteAmount}
          currency={this.state.acceptedQuoteCurrency}
          destinationAddress={this.state.acceptedQuoteDestinationAddress}
        />
      </div>
    );
  }
});

module.exports = Payment;
