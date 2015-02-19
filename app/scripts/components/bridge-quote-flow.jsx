'use strict';

var ReactIntl = require('react-intl');
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var React = require('react');
var Morearty = require('morearty');
var Button = require('react-bootstrap').Button;
var WebfingerLookup = require('./webfinger-lookup.jsx');
// var BridgeQuoteInquiry = require('./bridge-quote-inquiry.jsx');
// var BridgeQuoteAccept = require('./bridge-quote-accept.jsx');
// var BridgeQuoteAcceptedQuote = require('./bridge-quote-accepted-quote.jsx');
var Input = require('./input-validation.jsx');
var Step = require('./flow-step.jsx');
var ActionCreators = require('../actions/ActionCreators');

var BridgeQuoteFlow = React.createClass({

  mixins: [IntlMixin, Morearty.Mixin],

  completeStep1: function(data) {
    console.log('step 1 complete', data);
    // this.setState(data);
    // ActionCreators.incrementStep();
  },

  // completeStep2: function(data) {
  //   this.setState(data);
  //   ActionCreators.incrementStep();
  // },

  // completeStep3: function(data) {
  //   this.setState(data);
  //   ActionCreators.incrementStep();
  // },

  resetForm: function() {
    location.reload();
  },

  render: function() {
    var binding = this.getBinding();
    var stateMachineBinding = binding.sub('stateMachine');
    var webfingerBinding = binding.sub('webfinger');
    var quoteBinding = binding.sub('quote');
    var destinationAddressBinding = binding.sub('bridgeQuoteInquiryForm.destination_address');
    var destinationAmountBinding = binding.sub('bridgeQuoteInquiryForm.destination_amount');
    var resetButton, activeStep;

    resetButton = <FormattedMessage message={this.getIntlMessage('resetButton')} />;

    activeStep = stateMachineBinding.get('activeStep');

    return (
      <div className=''>
        <h3 className='clearfix'>
          <Button bsStyle='warning' className='pull-right' onClick={this.resetForm}>{resetButton}</Button>
        </h3>

        <Step
          thisStep={1}
          activeStep={activeStep}
          stepComponent={WebfingerLookup}
          childArgs = {{
            onSuccessCb: this.completeStep1,
            id:'webfinger-lookup',
            binding: webfingerBinding
          }}
        />

        <Input
          name='destination_address'
          type='text'
          binding={destinationAddressBinding}
        />
        <Input
          name='destination_amount'
          type='number'
          binding={destinationAmountBinding}
        />

        {/*
        <Step
          thisStep={2}
          activeStep={activeStep}
          stepComponent={BridgeQuoteInquiry}
          childArgs={{
            // onSuccessCb: this.completeStep2,
            federatedAddress: webfingerBinding.get('federatedAddress'),
            bridgeQuoteUrl: webfingerBinding.get('bridgeQuoteUrl')
          }}
        />

        <Step
          thisStep={3}
          activeStep={activeStep}
          stepComponent={BridgeQuoteAccept}
          hideIfInactive={true}
          childArgs={{
            // onSuccessCb: this.completeStep3,
            federatedAddress: webfingerBinding.get('federatedAddress'),
            bridgeQuoteUrl: webfingerBinding.get('bridgeQuoteUrl'),
            quotes: quoteBinding.get('quotes')
          }}
        />

        <Step
          thisStep={4}
          activeStep={activeStep}
          hideIfInactive={true}
          stepComponent={BridgeQuoteAcceptedQuote}
          childArgs={{
            amount: Number(quoteBinding.get('acceptedQuoteAmount')),
            currency: quoteBinding.get('acceptedQuoteCurrency'),
            debitAccount: quoteBinding.get('acceptedQuoteDebitAccount'),
            creditAccount: quoteBinding.get('acceptedQuoteCreditAccount')
          }}
        />
        */}
    </div>
    );
  }
});

module.exports = BridgeQuoteFlow;
