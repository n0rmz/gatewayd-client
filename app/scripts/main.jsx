'use strict';

if (!window.Intl) {
  window.Intl = require('intl');
}

var React = require('react');
var Morearty = require('morearty');
var Reflux = require('reflux');
var stringLib = require('../i18n/messages');
var App = require('./components/app.jsx');
var initialAppState, Ctx, AppWrapper, Bootstrap;

// needed for dev tools to work
window.React = React;

// TODO - refactor to separate file and create API for initializing context
initialAppState = {
  stateMachine: {
    activeStep: 1
    // federatedAddress: '',
    // bridgeQuoteUrl: '',
    // quotes: {},
    // acceptedQuoteAmount: null,
    // acceptedQuoteCurrency: '',
    // acceptedQuoteDebitAccount: '',
    // acceptedQuoteCreditAccount: ''
  },
  webfinger: {
    federatedAddress: '',
    inputState: null,
    message: '',
    bridgeQuoteUrl: ''
  },
  quote: {},
  bridgeQuoteInquiryForm: {
    destination_address: {
      name: 'destination_address',
      label: 'Destination Address',
      bsStyle: null,
      value: 'test',
      isDisabled: false,
      isValid: false,
      errorMessage: ''
    },
    destination_amount: {
      name: 'destination_amount',
      label: 'Destination Amount',
      bsStyle: null,
      value: '-1',
      isDisabled: false,
      isValid: false,
      errorMessage: ''
    },
    destination_currency: {},
    isValid: false
  }
};

// empty objects in arguments are required to boot app with initialAppState
// console will warn:
// "Passing multiple arguments to createContext is deprecated. Use single object form instead."
// ignore it!
Ctx = Morearty.createContext(initialAppState, {}, {});

// extend new stores with Morearty context for Immutable data
Reflux.StoreMethods.getMoreartyContext = function() {
  return Ctx;
};

// stores MUST be initialized after adding Morearty Context to StoreMethods
require('./stores/state-machine');
require('./stores/webfinger');
require('./stores/quote-inquiry');

AppWrapper = React.createClass({
  mixins: [Morearty.Mixin],

  render: function() {
    var binding = this.getBinding();

    return (
      <App {...stringLib} locales={['en-US']} binding={binding} />
    );
  }
});

Bootstrap = Ctx.bootstrap(AppWrapper);

React.render(
  <Bootstrap/>,
  document.getElementById('content-main')
);
