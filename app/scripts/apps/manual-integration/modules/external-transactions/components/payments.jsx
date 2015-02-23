'use strict';

const _ = require('lodash');
const url = require('url');
const Backbone= require('backbone');

const ReactIntl = require('react-intl');
const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;
const React = require('react');
const DocumentTitle = require('react-document-title');

// React Router
const Router = require('react-router');
const {Route, Redirect, RouteHandler, Link, State} = Router;
const HandleActiveState = require('scripts/shared/mixins/components/handle-active-state');

const PaymentItem = require('./payment.jsx');

const Collection = require('../collections/payments');
let collection = new Collection();

const Actions = require('scripts/actions');

const appConfig = require('app-config.json');

let Payments = React.createClass({

  mixins: [IntlMixin, State, HandleActiveState],

  getInitialState: function() {

    // TODO - separate the backbone collection from the state and retrieve only its JSON representation
    return {
      payments: []
    };
  },

  componentWillMount: function() {
    this.navigationInfoMap = this.buildNavigationInfoMap();
  },

  componentDidMount: function() {
    this.setState({
      payments: collection.toJSON()
    });

    collection.on('fetchedTransactions refreshedTransactions sync', this.handleCollectionSync);
  },

  componentWillUnmount: function() {
    collection.off();
  },

  handleCollectionSync: function(collection, data) {
    this.setState({
      payments: collection.toJSON()
    });
  },

  createTitle: function(transactionType) {
    transactionType = transactionType || 'Deposits';

    const titleMap = {
      deposits: 'titleDeposits',
      withdrawals: 'titleWithdrawals'
    };

    return this.getIntlMessage(titleMap[transactionType]);
  },

  transactionTypeMap: {
    deposits: true,
    withdrawals: false
  },

  // tertiary nav config: transactionType => path to link to => anchor label
  navigationInfoMap: {},

  buildNavigationInfoMap: function() {
    let navigationInfoMap = {};

    // transactionType === withdrawals or deposits
    _.each(appConfig.status, (statusCollection, transactionType) => {

      // navigation includes all 'status' to display every transaction of specific type
      navigationInfoMap[transactionType] = {
        all: 'transactionFilterAll'
      };

      _.each(statusCollection, (statusDetails, statusName) => {
        navigationInfoMap[transactionType][statusName] = statusDetails.navTitle;
      });
    });

    return navigationInfoMap;
  },

  buildNavigation: function(navigationInfoMap, transactionType) {
    let links = _.map(navigationInfoMap[transactionType], (linkLabel, transactionState) => {
      let activeClass = '',
          params = {
            transactionType: transactionType,
            state: transactionState
          };

      if (this.isActive('transactions', transactionState)) {
        activeClass = 'active';
      }

      return (
        <Link key={_.uniqueId()} to='external-transactions' params={params} className={activeClass}>
          <FormattedMessage message={this.getIntlMessage(linkLabel)} />
        </Link>
      );
    });

    return (
      <div className='nav-tertiary'>
        {links}
      </div>
    );
  },

  render: function() {
    let transactionType = this.getParams().transactionType,
        state = this.getParams().state,
        tertiaryNav, paymentItems;

    // less than ideal, will refactor when we have pagination, if not sooner.
    // We could keep different collections for each type, but it depends on use case.
    paymentItems = _.chain(this.state.payments)
      .filter(model => {
        return model.deposit === this.transactionTypeMap[transactionType];
      })
      .filter(model => {
        return state === 'all'? true : model.status === state;
      })
      .map(model => {
        return (
          <PaymentItem
            key={model.id}
            model={model}
          />
        );
      }, this);

    tertiaryNav = this.buildNavigation(this.navigationInfoMap, transactionType);

    return (
      <DocumentTitle title={this.createTitle(transactionType)}>
        <div>
          <div className='row'>
            <div className='col-sm-12 col-xs-12'>
              <h1>
                <span className='header-links'>
                  <Link
                    to='external-transactions'
                    params={{transactionType: 'withdrawals', state: 'all'}}
                    className={this.handleActiveState({href: '/external-transactions/withdrawals'})}
                  >
                    <FormattedMessage message={this.getIntlMessage('transactionNavCredits')} />
                  </Link>
                  <Link
                    to='external-transactions'
                    params={{transactionType: 'deposits', state: 'all'}}
                    className={this.handleActiveState({href: '/external-transactions/deposits'})}
                  >
                    <FormattedMessage message={this.getIntlMessage('transactionNavDebits')} />
                  </Link>
                </span>
              </h1>
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-12'>
              {tertiaryNav}
            </div>
          </div>
          <div className='row'>
            <ul className='list-group'>
              {paymentItems}
            </ul>
          </div>
        </div>
      </DocumentTitle>
    );
  }
});

module.exports = Payments;
