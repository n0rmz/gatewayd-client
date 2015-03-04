'use strict';

var path = require('path');
var _ = require('lodash');
var moment = require('moment');
var $ = require('jquery');
var Backbone = require('backbone');
var adminDispatcher = require('scripts/dispatchers/admin-dispatcher');
var Model = require('../models/payment');
var appConfig = require('app-config.json');
var heartbeats = require('heartbeats');
var pollingHeart = new heartbeats.Heart(1000);

Backbone.$ = $;

var Payments = Backbone.Collection.extend({

  model: Model,

  comparator: function(a, b) {
    return b.id - a.id;
  },

  initialize: function() {
    _.bindAll(this);

    adminDispatcher.register(this.dispatcherCallback);
    this.url = appConfig.baseUrl + path.join('/', 'v1', 'ripple_transactions', '?count=200');
    this.fetchNewRippleTransactions();

    // poll every 5 seconds
    pollingHeart.onBeat(5, this.fetchNewRippleTransactions);
  },

  dispatcherCallback: function(payload) {
    if (!_.isUndefined(this[payload.actionType])) {
      this[payload.actionType](payload.data);
    }
  },

  flagRipplePaymentAsDone: function(id) {
    var model = this.get(id);

    model.set({
      state: 'succeeded'
    });

    model.save('state', 'succeeded', {
      url: appConfig.baseUrl + path.join('/', 'v1', 'ripple_transactions', id)
    });
  },

  fetchRippleTransactions: function() {
    this.fetch({
      success: (coll, r) => {
        this.trigger('fetchedTransactions', coll);
      }
    });
  },

  setLatestPayment: function(payments) {
    var newestUpdatedPayment;

    // todo: can't rely on response sorting at the moment
    // look into timestamp issues later
    if (payments.length) {
      newestUpdatedPayment = _.max(payments, function(payment) {
        return Date.parse(payment.updatedAt);
      });

      this.latestPayment = newestUpdatedPayment.updatedAt;
    } else {
      this.latestPayment = this.at(0).get('updatedAt');
    }
  },

  getLatestPayment: function() {
    return this.latestPayment || this.at(0).get('updatedAt');
  },

  getNewTransactionsUrl: function() {
    var timeStamp = encodeURIComponent(moment(this.getLatestPayment())
                                       .format('YYYY-MM-DD HH:mm:ss.SSS'));

    return this.url + '&sort_direction=asc' + '&index=' + timeStamp;
  },

  fetchNewRippleTransactions: function() {

    var firstModel = this.at(0);

    //if collection is empty, do a normal fetch
    //this is required since there is no first index from which to pull
    if (!firstModel) {
      this.fetchRippleTransactions();
      return false;
    }

    this.fetch({
      url: this.getNewTransactionsUrl(),
      remove: false,
      success: (coll, r) => {

        //do nothing if nothing returned
        if (!r.ripple_transactions.length) {
          return false;
        }

        //todo: not sure why we need to set explicitly
        //rather than letting bbone merge data
        this.set(r.ripple_transactions, {remove: false});
        this.trigger('refreshedTransactions', coll);
        this.setLatestPayment(r.ripple_transactions);
      }
    });
  },

  parse: function(data) {
    return data.ripple_transactions;
  },

  sendRipplePaymentComplete: function(paymentData) {
    this.add(paymentData);
    this.trigger('sendRipplePaymentComplete', this);
    this.get(paymentData.id).pollStatus();
  }
});

module.exports = Payments;
