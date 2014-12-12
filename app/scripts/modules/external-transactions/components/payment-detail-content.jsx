"use strict";

var moment = require('moment');
var React = require('react');

var PaymentDetailContent = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
    paymentDetailClassName: React.PropTypes.string
  },

  render: function() {
    return (
      <div className={this.props.paymentDetailClassName}>
        <div className="row border-bottom">
          Updated {moment(this.props.model.get('updatedAt')).format('MMM D, YYYY HH:mm z')}
        </div>
        <br />
        <div className="row">
          Transaction Id: {this.props.model.get('id')}
        </div>
        <br />
        <div className="row">
          UID: {this.props.model.get('uid')}
        </div>
        <br />
        <div className="row">
          <div className="col-sm-4 col-xs-12">
            Source Account Id: {this.props.model.get('source_account_id')}
          </div>
          <div className="col-sm-4 col-xs-12">
            Amount: {this.props.model.get('source_amount')}
          </div>
          <div className="col-sm-4 col-xs-12">
            Currency: {this.props.model.get('source_currency')}
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-sm-4 col-xs-12">
            Destination Account Id: {this.props.model.get('destination_account_id')}
          </div>
          <div className="col-sm-4 col-xs-12">
            Amount: {this.props.model.get('destination_amount')}
          </div>
          <div className="col-sm-4 col-xs-12">
            Currency: {this.props.model.get('destination_currency')}
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-sm-6 col-xs-12">
            External Account Id: {this.props.model.get('external_account_id')}
          </div>
          <div className="col-sm-6 col-xs-12">
            Ripple Transaction Id: {this.props.model.get('ripple_transaction_id')}
          </div>
        </div>
        <br />
        <div className="row">
          Invoice Id: {this.props.model.get('invoice_id') || 'none'}
        </div>
        <br />
        <div className="row">
          Data: {this.props.model.get('data') || 'none'}
        </div>
        <br />
        <div className="row">
          Memos: {this.props.model.get('memos') || 'none'}
        </div>
      </div>
    );
  }
});

module.exports = PaymentDetailContent;
