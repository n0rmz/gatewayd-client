"use strict";

var React = require('react');
var path = require('path');
var RippleAddressLookup = require('../../ripple-address-lookup/components/ripple-address-lookup.jsx');
var BridgeQuoteInquiry = require('../../bridge-quote/components/bridge-quote-inquiry.jsx');
var BridgeQuoteAccept = require('../../bridge-quote/components/bridge-quote-accept.jsx');

var Payment = React.createClass({

  //todo - make a real state machine mixin later. Let's hack now
  //for expedience
  getInitialState: function() {
    return {
      currentStep: 1,
      federatedAddress: '',
      bridgeQuoteUrl: ''
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

  completeStep4: function(data) {
    console.log('step 4 completed', arguments);
    this.setState(data);
    this.incrementStep();
  },

  render: function() {

    return (
      <div className="">
        <h3>Get quote to send a payment</h3>
        <RippleAddressLookup
          isDisabled={(this.state.currentStep !== 1) ? true : false}
          onSuccessCb={this.completeStep1}
          label="Who is the sender?"
          id="ripple-address-lookup"
          placeholder="Enter a federated address"
        />
        <BridgeQuoteInquiry
          isDisabled={(this.state.currentStep !== 2) ? true : false}
          federatedAddress={this.state.federatedAddress}
          bridgeQuoteUrl={this.state.bridgeQuoteUrl}
          onSuccessCb={this.completeStep2}
        />
        <BridgeQuoteAccept
          onSuccessCb={this.completeStep3}
          bridgeQuoteUrl={this.state.bridgeQuoteUrl}
        />
      </div>
    );
  }
});

module.exports = Payment;
