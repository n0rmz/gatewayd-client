'use strict';

var _ = require('lodash');
var url = require('url');
var Backbone= require('backbone');

var ReactIntl = require('react-intl');
var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var React = require('react');
var DocumentTitle = require('react-document-title');

// React Router
var Router = require('react-router');
var ActiveState = require('react-router').ActiveState;
var Link = require('react-router').Link;


// React Bootstrap
var ModalTrigger = require('react-bootstrap').ModalTrigger;

var AccountItem = require('./account.jsx');

var Collection = require('../collections/accounts');
var collection = new Collection();

var AccountCreateFormModel = require('../models/account-create');
var accountCreateFormModel = new AccountCreateFormModel();
var AccountCreateForm = require('./account-create.jsx');

var Actions = require('scripts/actions');

var Accounts = React.createClass({

  mixins: [IntlMixin, ActiveState, Router.State],

  getInitialState: function() {

    // TODO - separate the backbone collection from the state and retrieve only its JSON representation
    return {
      accounts: collection.toJSON()
    };
  },

  componentDidMount: function() {
    collection.on('sync', this.handleCollectionSync);
  },

  componentWillUnmount: function() {
    collection.off();
  },

  // @data payment collection or model
  handleCollectionSync: function(collection, data) {

    // TODO - is there a better way to handle separation of collection vs model syncs?
    if (data instanceof Backbone.Model) {

      // changing a model in the collection/state won't trigger a re-render
      this.forceUpdate();

      return false;
    } else {
      this.setState({
        accounts: data.external_accounts
      });
    }
  },

  createTitle: function(accountType) {
    var titleKey = 'titleAccountsAll',
        titleMap = {
          customer: 'titleAccountsCustomer',
          gateway: 'titleAccountsGateway'
        };

    if (accountType && titleMap[accountType]) {
      titleKey = titleMap[accountType];
    }

    return this.getIntlMessage(titleKey);
  },

  typeMap: {
    acct: 'customer',
    gateway: 'gateway'
  },

  render: function() {
    var accountType = this.getParams().accountType;

    // less than ideal, will refactor when we have pagination, if not sooner.
    // We could keep different collections for each type, but it depends on use case.
    var paymentItems = _.chain(this.state.accounts)
      .filter(model => {
        return accountType === 'all' || this.typeMap[model.type] === accountType;
      })
      .map(model => {
        return (
          <AccountItem
            key={model.id}
            model={model}
          />
        );
    }, this);

    return (
      <DocumentTitle title={this.createTitle(accountType)}>
        <div>
          <div className='row'>
            <div className='col-sm-12 col-xs-12'>
              <h1>
                <FormattedMessage message={this.getIntlMessage('accountsHeader')} />
                <span className='header-links'>
                  <Link to='external-accounts' params={{accountType: 'all'}}>
                    <FormattedMessage message={this.getIntlMessage('accountsNavAll')} />
                  </Link>
                  <Link to='external-accounts' params={{accountType: 'gateway'}}>
                    <FormattedMessage message={this.getIntlMessage('accountsNavGateway')} />
                  </Link>
                  <Link to='external-accounts' params={{accountType: 'customer'}}>
                    <FormattedMessage message={this.getIntlMessage('accountsNavCustomer')} />
                  </Link>
                  <ModalTrigger modal={<AccountCreateForm model={accountCreateFormModel} />}>
                    <a>
                      <FormattedMessage message={this.getIntlMessage('accountsNavCreate')} />
                    </a>
                  </ModalTrigger>
                </span>
              </h1>
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

module.exports = Accounts;
