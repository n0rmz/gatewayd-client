"use strict";

var adminDispatcher = require('../../dispatchers/admin-dispatcher');
var rippleAddressLookup = require('./config.json').actions;

var actions = {
  setFederatedAddress: function(address) {
    adminDispatcher.handleEvent({
      actionType: rippleAddressLookup.setFederatedAddress,
      data: address
    });
  },

  resolveAddress: function() {
    adminDispatcher.handleEvent({
      actionType: rippleAddressLookup.resolveAddress
    });
  }
};

module.exports = actions;
