'use strict';

var _ = require('lodash');
var html = require('reqwest');
var path = require('path');
var ActionCreators = require('../actions/ActionCreators');

var findQuoteUrl = function(links) {
  var findKey = 'https://gatewayd.org/gateway-services/bridge_payments';

  //given links object, return the bridge quote link
  //NOTE: 'template' is likely to change to 'ref' when updated to spec
  return _.find(links, function(link) {
    return link.rel === findKey;
  }).template;
};

var getErrorMessage = function(error) {
  if (_.isUndefined(error) || _.isNull(error)) {
    return 'Internal Server Error';
  }

  return JSON.parse(error.responseText).error;
};

module.exports = {
  webfingerUser: function(federatedAddress) {
    html({
      url: 'https://localhost:5000' + path.join('/', '.well-known/webfinger.json?resource=acct:' + encodeURIComponent(federatedAddress)),
      method: 'get'
    })
    .then(function(response) {
      ActionCreators.receiveBridgeQuoteUrl(findQuoteUrl(response.links));
    })
    .fail(function(error) {
      ActionCreators.receiveBridgeQuoteUrlFail(getErrorMessage(error));
    });
  }
};
