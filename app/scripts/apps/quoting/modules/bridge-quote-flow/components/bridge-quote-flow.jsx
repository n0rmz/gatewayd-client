'use strict';

var ReactIntl = require('react-intl');
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var React = require('react');
var path = require('path');
var Button = require('react-bootstrap').Button;
var RippleAddressLookup = require('../../ripple-address-lookup/components/ripple-address-lookup.jsx');
var BridgeQuoteInquiry = require('../../bridge-quote-get/components/bridge-quote-inquiry.jsx');
var BridgeQuoteAccept = require('../../bridge-quote/components/bridge-quote-accept.jsx');
var BridgeQuoteAcceptedQuote = require('../../bridge-quote/components/bridge-quote-accepted-quote.jsx');
var Step = require('./flow-step.jsx');

var Payment = React.createClass({

  mixins: [IntlMixin],

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
      acceptedQuoteDebitAccount: '',
      acceptedQuoteCreditAccount: ''
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
    var resetButton, activeStep;

    resetButton = <FormattedMessage message={this.getIntlMessage('resetButton')} />;
    activeStep = this.state.activeStep;

    return (
      <div className=''>
        <h3 className='clearfix'>
          <Button bsStyle='warning' className='pull-right' onClick={this.resetForm}>{resetButton}</Button>
        </h3>

        <Step
          thisStep={1}
          activeStep={activeStep}
          stepComponent={RippleAddressLookup}
          childArgs = {{
            onSuccessCb: this.completeStep1,
            id:'ripple-address-lookup'
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
            amount: Number(this.state.acceptedQuoteAmount),
            currency: this.state.acceptedQuoteCurrency,
            debitAccount: this.state.acceptedQuoteDebitAccount,
            creditAccount: this.state.acceptedQuoteCreditAccount
          }}
        />
    </div>
    );
  }
});

module.exports = Payment;
