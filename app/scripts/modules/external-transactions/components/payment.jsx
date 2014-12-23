"use strict";

var moment = require('moment');
var React = require('react');
var ModalTrigger = require('react-bootstrap').ModalTrigger;
var PaymentDetailModal = require('./payment-detail-modal.jsx');
var PaymentDetailContent = require('./payment-detail-content.jsx');
var Chevron = require('../../../shared/components/glyphicon/chevron.jsx');

var Payment = React.createClass({
  propTypes: {
    model: React.PropTypes.object
  },

  handleDetailIconClick: function(id) {
    this.setState({
      showDetails: !this.state.showDetails
    });
  },

  showSpinningIcon: function() {
    this.setState({
      refreshIconClasses: 'glyphicon glyphicon-refresh glyphicon-spin'
    });
  },

  hideSpinningIcon: function() {
    this.setState({
      refreshIconClasses: ''
    });
  },

  getInitialState: function() {
    return {
      refreshIconClasses: '',
      showDetails: false
    };
  },

  componentDidMount: function() {
    this.props.model.on('pollingStart', this.showSpinningIcon);
    this.props.model.on('pollingStop', this.hideSpinningIcon);
  },

  componentWillUnmount: function() {
    this.props.model.off('pollingStart pollingStop');
  },

  render: function() {
    var _this = this;
    var doneButton, refreshIcon, fromAddress, toAddress;
    var paymentItemClasses = 'modal-container';

    // highlight new transactions
    if (this.props.model.get('new')) {
      paymentItemClasses += ' highlight';
    }

    if (!this.props.model.get('deposit') && this.props.model.get('status') === 'queued') {
      doneButton = (
        <ModalTrigger modal={<PaymentDetailModal model={this.props.model} />}>
          <button className="btn pull-right">
            Process
          </button>
        </ModalTrigger>
      );
    } else {
      doneButton = false;
    }

    return (
      <li className={"payment-item list-group-item " + paymentItemClasses} ref="container">
        <div className="row">
          <div className="col-xs-3">
            <p>
              <span className="header">Id: </span>
              <span className="data">{this.props.model.get('id')} </span>
            </p>
          </div>
          <div className="col-xs-3">
            <p>
              <span className="header">Destination Account Id: </span>
              <span className="data">{this.props.model.get('destination_account_id')} </span>
            </p>
          </div>
          <div className="col-xs-3 text-right">
            <p>
              <span className="header">Amount: </span>
              <span className="data">{this.props.model.get('destination_amount')} </span>
              <span className="currency">{this.props.model.get('destination_currency')}</span>
            </p>
          </div>
          <div className="col-xs-3 text-right">
            <p>
              <span className="header">Status: </span>
              <span className="data">{this.props.model.get('status')} </span>
              <span className={this.state.refreshIconClasses} />
            </p>
            {doneButton}
          </div>
        </div>
        <div className="row">
          <div className="col-sm-8">
          </div>
          <div className="col-sm-4">
          </div>
        </div>
        <div className="clearfix">
          <span className="date pull-left">
            {moment(this.props.model.get('createdAt')).format('MMM D, YYYY HH:mm z')}
          </span>
          <Chevron
            clickHandler={this.handleDetailIconClick.bind(this, this.props.model.get('id'))}
            iconClasses="pull-right"
          />
        </div>
        <div>
          {this.state.showDetails ?
            <PaymentDetailContent model={this.props.model} paymentDetailClassName={"details"}/>
            : false}
        </div>
      </li>
    );
  }
});

module.exports = Payment;
