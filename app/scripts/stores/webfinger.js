'use strict';

var Morearty = require('morearty');
var Reflux = require('reflux');
var ActionCreators = require('../actions/ActionCreators');

var WebfingerStore = Reflux.createStore({

  listenables: ActionCreators,

  init: function() {
    this.rootBinding =
      this.getMoreartyContext().getBinding();
    this.webfingerBinding = this.rootBinding.sub('webfinger');
  },

  onSetFederatedAddress: function(newAddress) {
    this.webfingerBinding
      .atomically()
      .set('federatedAddress', newAddress)
      .set('message', '')
      .set('inputState', null)
      .commit();
  },

  onReceiveBridgeQuoteUrl: function(bridgeQuoteUrl) {
    this.webfingerBinding
      .atomically()
      .set('bridgeQuoteUrl', bridgeQuoteUrl)
      .set('message', '')
      .set('inputState', 'success')
      .commit();
  },

  onReceiveBridgeQuoteUrlFail: function(errorMessage) {
    this.webfingerBinding
      .atomically()
      .set('message', errorMessage)
      .set('inputState', 'error')
      .commit();
  }
});

module.exports = WebfingerStore;
