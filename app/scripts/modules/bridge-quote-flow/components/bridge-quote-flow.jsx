"use strict";

var React = require('react');
var path = require('path');
var Button = require('react-bootstrap').Button;
var RippleAddressLookup = require('../../ripple-address-lookup/components/ripple-address-lookup.jsx');
var BridgeQuoteInquiry = require('../../bridge-quote-get/components/bridge-quote-inquiry.jsx');
var BridgeQuoteAccept = require('../../bridge-quote/components/bridge-quote-accept.jsx');
var BridgeQuoteAcceptedQuote = require('../../bridge-quote/components/bridge-quote-accepted-quote.jsx');
var Step = require('./flow-step.jsx');

var Payment = React.createClass({

  //todo - make a real state machine mixin later. Let's hack now
  //for expedience
  getInitialState: function() {
    return {
      activeStep: 1,
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
      activeStep: (this.state.activeStep + 1)
    });
  },

  completeStep1: function(data) {
    this.setState(data);
    this.incrementStep();
  },

  completeStep2: function(data) {
    this.setState(data);
    this.incrementStep();
  },

  completeStep3: function(data) {
    this.setState(data);
    this.incrementStep();
  },

  resetForm: function() {
    location.reload();
  },

  render: function() {
    var test = RippleAddressLookup;
    var activeStep = this.state.activeStep;

    return (
      <div className="">
        <h3>Get quote to send a payment
          <Button bsStyle="warning" className="pull-right" onClick={this.resetForm}>Cancel and Start Over</Button>
        </h3>

        <Step
          thisStep={1}
          activeStep={activeStep}
          stepComponent={RippleAddressLookup}
          childArgs = {{
            onSuccessCb: this.completeStep1,
            label: "Who is the Sender?",
            id:"ripple-address-lookup",
            placeholder:"Enter a federated address"
          }}
        />

        <Step
          thisStep={2}
          activeStep={activeStep}
          stepComponent={BridgeQuoteInquiry}
          childArgs={{
            onSuccessCb: this.completeStep2,
            federatedAddress: this.state.federatedAddress,
            bridgeQuoteUrl: this.state.bridgeQuoteUrl
          }}
        />

        <Step
          thisStep={3}
          activeStep={activeStep}
          stepComponent={BridgeQuoteAccept}
          hideIfInactive={true}
          childArgs={{
            onSuccessCb: this.completeStep3,
            federatedAddress: this.state.federatedAddress,
            bridgeQuoteUrl: this.state.bridgeQuoteUrl,
            quotes: this.state.quotes
          }}
        />

        <Step
          thisStep={4}
          activeStep={activeStep}
          hideIfInactive={true}
          stepComponent={BridgeQuoteAcceptedQuote}
          childArgs={{
            amount: this.state.acceptedQuoteAmount,
            currency: this.state.acceptedQuoteCurrency,
            destinationAddress: (this.state.acceptedQuoteDestinationAddress).toString()
          }}
        />
    </div>
    );
  }
});

module.exports = Payment;
