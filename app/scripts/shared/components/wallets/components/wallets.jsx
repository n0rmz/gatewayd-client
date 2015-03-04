'use strict';

var React = require('react');
var Wallet = require('./wallet.jsx');
var walletActions = require('scripts/actions');
var Balances = require('../collections/balances');
var hotWalletBalances = new Balances([], {walletType: 'hot'});
var coldWalletBalances = new Balances([], {walletType: 'cold'});

var Wallets = React.createClass({
  componentDidMount: function() {
    hotWalletBalances.on('sync', () => {
      this.forceUpdate();
    });

    coldWalletBalances.on('sync', () => {
      this.forceUpdate();
    });

    walletActions.fetchBalances();
  },

  componentWillUnmount: function() {
    hotWalletBalances.off();
    coldWalletBalances.off();
  },

  render: function() {
    return (
      <div>
        <Wallet type='hot' collection={hotWalletBalances} />
        <Wallet type='cold' collection={coldWalletBalances} />
      </div>
    );
  }
});

module.exports = Wallets;
