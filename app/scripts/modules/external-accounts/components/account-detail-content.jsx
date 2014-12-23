"use strict";

var moment = require('moment');
var React = require('react');

var AccountDetailContent = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
    accountDetailClassName: React.PropTypes.string
  },

  render: function() {
    return (
      <div className={this.props.accountDetailClassName}>
        <div className="row border-bottom">
          Updated {moment(this.props.model.get('updatedAt')).format('MMM D, YYYY HH:mm z')}
        </div>
        <br />
        <div className="row">
          Account Id: {this.props.model.get('id')}
        </div>
        <br />
        <div className="row">
          Unique Id: {this.props.model.get('uid')}
        </div>
        <br />
        <div className="row">
          <div className="col-sm-4 col-xs-12">
            Name: {this.props.model.get('name')}
          </div>
          <div className="col-sm-4 col-xs-12">
            Address: {this.props.model.get('address')}
          </div>
          <div className="col-sm-4 col-xs-12">
            Type: {this.props.model.get('type')}
          </div>
        </div>
        <br />
        <div className="row">
          User Id: {this.props.model.get('user_id')}
        </div>
        <br />
        <div className="row">
          Data: {this.props.model.get('data') || 'none'}
        </div>
      </div>
    );
  }
});

module.exports = AccountDetailContent;
