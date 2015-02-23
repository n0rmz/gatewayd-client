'use strict';

const _ = require('lodash');
const url = require('url');
const Backbone = require('backbone');

const stringLib = require('../../../i18n/ripple-messages');
const ReactIntl = require('react-intl');
const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;
const React = require('react');
const DocumentTitle = require('react-document-title');

// React Router
const Router = require('react-router');
const {Route, Redirect, RouteHandler, Link, State} = Router;
const HandleActiveState = require('scripts/shared/mixins/components/handle-active-state');

// React Bootstrap
const ModalTrigger = require('react-bootstrap').ModalTrigger;

const PaymentItem = require('./payment.jsx');

const Collection = require('../collections/payments');
let collection = new Collection();

const PaymentCreateFormModel = require('../models/payment-create');
let paymentCreateFormModel = new PaymentCreateFormModel();
const PaymentCreateForm = require('./payment-create.jsx');

const Actions = require('scripts/actions');

let Payments = React.createClass({
  mixins: [IntlMixin, State, HandleActiveState],

  getInitialState: function() {
    return {
      payments: []
    };
  },

  componentDidMount: function() {
    this.setState({
      payments: collection.toJSON()
    });

    collection.on('fetchedTransactions refreshedTransactions sendRipplePaymentComplete', this.handleCollectionSync);

    //this handles the model polling for 'retry'
    collection.on('polling', this.handlePolling);
  },

  componentWillUnmount: function() {
    collection.off('fetchedTransactions refreshedTransactions sendRipplePaymentComplete polling');
  },

  handlePolling: function(data) {
    let payment =  _.find(this.state.payments, {id: data.id});

    payment.isPolling = data.isPolling;

    //todo: find more performant way to handle data
    this.forceUpdate();
  },

  handleCollectionSync: function(data) {
    this.setState({
      payments: data.toJSON()
    });
  },

  handleRetryButtonClick: function(id) {
    Actions.retryFailedPayment(id);
  },

  directionMap: {
    incoming: 'from-ripple',
    outgoing: 'to-ripple'
  },

  createTitle: function(direction) {
    direction = direction || 'incoming';

    let titleMap = {
      incoming: this.getIntlMessage('paymentsTitleReceived'),
      outgoing: this.getIntlMessage('paymentsTitleSent')
    };

    return titleMap[direction];
  },

  setDefaults: function(a, b) {
    return (_.isNull(a) || _.isUndefined(a)) ? b : a;
  },

  render: function() {
    let direction = this.getParams().direction,
        state = this.getParams().state,
        tertiaryNav;

    // less than ideal, will refactor when we have pagination, if not sooner.
    // We could keep different collections for each type, but it depends on use case.
    let paymentItems = _.chain(this.state.payments)
      .filter(payment => {
        return payment.direction === this.directionMap[direction];
      })
      .filter(payment => {
        return state === 'all' ? true : (payment.state === state);
      })
      .map(payment => {
        let addressDefaults = {
          address: 'none',
          tag: 'none',
          uid: null,
          data: null
        };

        let defaults = {
          invoice_id: 'none',
          transaction_hash: 'none'
        };

        payment = _.merge(payment, defaults, this.setDefaults);
        payment.toAddress = _.merge((payment.toAddress || {}), addressDefaults, this.setDefaults);
        payment.fromAddress = _.merge((payment.fromAddress || {}), addressDefaults, this.setDefaults);

        return (
          <PaymentItem
            key={payment.id}
            {...payment}
            retryButtonClickHandler={this.handleRetryButtonClick}
          />
        );
    }, this);

    //todo make separate component with iterator. Oy.
    if (direction === 'incoming') {
      tertiaryNav = (
        <div className='nav-tertiary'>
          <Link to='ripple-transactions' params={{direction: 'incoming', state: 'all'}}>
            <FormattedMessage message={this.getIntlMessage('paymentsNavAll')} />
          </Link>
          <Link to='ripple-transactions' params={{direction: 'incoming', state: 'invoice'}}>
            <FormattedMessage message={this.getIntlMessage('paymentsNavInvoice')} />
          </Link>
          <Link to='ripple-transactions' params={{direction: 'incoming', state: 'pending'}}>
            <FormattedMessage message={this.getIntlMessage('paymentsNavPending')} />
          </Link>
          <Link to='ripple-transactions' params={{direction: 'incoming', state: 'succeeded'}}>
            <FormattedMessage message={this.getIntlMessage('paymentsNavSucceeded')} />
          </Link>
          <Link to='ripple-transactions' params={{direction: 'incoming', state: 'failed'}}>
            <FormattedMessage message={this.getIntlMessage('paymentsNavFailed')} />
          </Link>
        </div>);
    } else {
      tertiaryNav = (
        <div className='nav-tertiary'>
          <Link to='ripple-transactions' params={{direction: 'outgoing', state: 'all'}}>
            <FormattedMessage message={this.getIntlMessage('paymentsNavAll')} />
          </Link>
          <Link to='ripple-transactions' params={{direction: 'outgoing', state: 'invoice'}}>
            <FormattedMessage message={this.getIntlMessage('paymentsNavInvoice')} />
          </Link>
          <Link to='ripple-transactions' params={{direction: 'outgoing', state: 'pending'}}>
            <FormattedMessage message={this.getIntlMessage('paymentsNavPending')} />
          </Link>
          <Link to='ripple-transactions' params={{direction: 'outgoing', state: 'succeeded'}}>
            <FormattedMessage message={this.getIntlMessage('paymentsNavSucceeded')} />
          </Link>
          <Link to='ripple-transactions' params={{direction: 'outgoing', state: 'failed'}}>
            <FormattedMessage message={this.getIntlMessage('paymentsNavFailed')} />
          </Link>
        </div>);
    }

    return (
      <DocumentTitle title={this.createTitle(direction)}>
        <div>
          <div className='row'>
            <div className='col-sm-12 col-xs-12'>
              <h1>
                <FormattedMessage message={this.getIntlMessage('paymentsHeader')} />
                <span className='header-links'>
                  <Link
                    className={this.handleActiveState({href: '/ripple-transactions/outgoing'})}
                    to='ripple-transactions' params={{direction: 'outgoing', state: 'all'}}>
                    <FormattedMessage message={this.getIntlMessage('paymentsNavSent')} />
                  </Link>
                  <Link
                    className={this.handleActiveState({href: '/ripple-transactions/incoming'})}
                    to='ripple-transactions' params={{direction: 'incoming', state: 'all'}}>
                    <FormattedMessage message={this.getIntlMessage('paymentsNavReceived')} />
                  </Link>
                  <ModalTrigger modal={<PaymentCreateForm {...stringLib} model={paymentCreateFormModel} />}>
                    <a>
                      <FormattedMessage message={this.getIntlMessage('paymentsNavSendPayment')} />
                    </a>
                  </ModalTrigger>
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
