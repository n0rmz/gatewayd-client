'use strict';

var path = require('path');
var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
var moment = require('moment');
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
    this.url = appConfig.baseUrl + path.join('/', 'v1', 'external_transactions');
    this.fetchNewExternalTransactions();

    // poll every 5 seconds
    pollingHeart.onBeat(5, this.fetchNewExternalTransactions);
  },

  dispatcherCallback: function(payload) {
    var handleAction = {};

    handleAction.flagExternalPaymentAsDone = this.flagExternalPaymentAsDone;
    handleAction.fetchExternalTransactions = this.fetchExternalTransactions;
    handleAction.fetchNewExternalTransactions = this.fetchNewExternalTransactions;
    handleAction.sendExternalPaymentComplete = this.sendExternalPaymentComplete;

    if (!_.isUndefined(this[payload.actionType])) {
      this[payload.actionType](payload.data);
    }
  },

  flagExternalPaymentAsDone: function(id) {
    var model = this.get(id);

    if (model.get('deposit')) {
      model.set({
        status: 'processed'
      });
    } else {
      model.set({
        status: 'succeeded'
      });
    }

    model.save(null, {
      url: appConfig.baseUrl + path.join('/', 'v1', 'external_transactions', id.toString())
    });
  },

  fetchExternalTransactions: function() {
    if (_.isUndefined(this.url)) {
      this.url = appConfig.baseUrl + path.join('/', 'v1', 'external_transactions');
    }

    this.fetch({
      url: this.url + '?count=200',
      success: (collection, response) => {
        this.trigger('fetchedTransactions', collection);
      }
    });
  },

  getNewExternalTransactionsUrl: function(updatedAt) {
    var timeStamp = encodeURIComponent(moment(updatedAt).format('YYYY-MM-DD HH:mm:ss.SSS'));

    return this.url + '?count=200' + '&sort_direction=asc' + '&index=' + timeStamp;
  },

  fetchNewExternalTransactions: function() {
    if (!this.length) {
      this.fetchExternalTransactions();
      return false;
    }

    var url = this.getNewExternalTransactionsUrl(this.at(0).get('updatedAt'));

    this.fetch({
      url: url,
      remove: false,
      success: (collection, response) => {

        // do nothing if nothing returned
        if (!response.external_transactions.length) {
          return false;
        }

        // todo: not sure why we need to set explicitly
        // rather than letting bbone merge data
        this.set(response.external_transactions, {remove: false});
        this.trigger('refreshedTransactions', collection);
      }
    });
  },

  parse: function(data) {
    return data.external_transactions;
  },

  sendExternalPaymentComplete: function(paymentData) {
    this.fetch({
      success: () => {

        // poll status of sent payment until failed/succeeded to see changes
        // this.get(paymentData.id).pollStatus();
      }
    });
  }
});

module.exports = Payments;
