'use strict';

var Reflux = require('reflux');
var WebAPIUtils;

var ActionCreators = Reflux.createActions([
  'incrementStep',
  'setFederatedAddress',
  'getQuotingAddress',
  'receiveBridgeQuoteUrl',
  'receiveBridgeQuoteUrlFail',
  'setInput',
  'validateInput'
]);

ActionCreators.getQuotingAddress.listen(function(federatedAddress) {
  WebAPIUtils.webfingerUser(federatedAddress);
});

module.exports = ActionCreators;

WebAPIUtils = require('../utils/WebAPIUtils');
