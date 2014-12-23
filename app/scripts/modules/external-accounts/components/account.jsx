"use strict";

var moment = require('moment');
var React = require('react');
var ModalTrigger = require('react-bootstrap').ModalTrigger;
var AccountDetailContent = require('./account-detail-content.jsx');

var Account = React.createClass({
  propTypes: {
    model: React.PropTypes.object
  },

  toggleDetails: function() {
    var iconMap = {
      down: 'pull-right glyphicon glyphicon-chevron-down',
      up: 'pull-right glyphicon glyphicon-chevron-up'
    };

    if (this.state.chevronIcon === iconMap.down) {
      this.setState({
        chevronIcon: iconMap.up,
      });
    } else {
      this.setState({
        chevronIcon: iconMap.down
      });
    }

    this.setState({
      showDetails: !this.state.showDetails
    });
  },

  handleDetailIconClick: function(id) {
    this.toggleDetails();
  },

  getInitialState: function() {
    return {
      chevronIcon: 'pull-right glyphicon glyphicon-chevron-down',
      showDetails: false
    };
  },

  render: function() {
    var _this = this;
    var accountItemClasses = '';

    return (
      <li className={"payment-item list-group-item " + accountItemClasses}>
        <div className="row">
          <div className="col-sm-3">
            <p>
              <span className="header">Id: </span>
              <span className="data">{this.props.model.get('id')} </span>
            </p>
          </div>
          <div className="col-sm-3">
            <p>
              <span className="header">Name: </span>
              <span className="data">{this.props.model.get('name')} </span>
            </p>
          </div>
          <div className="col-sm-3 text-right">
            <p>
              <span className="header">Address: </span>
              <span className="data">{this.props.model.get('address')} </span>
            </p>
          </div>
          <div className="col-sm-3 text-right">
            <p>
              <span className="header">Type: </span>
              <span className="data">{this.props.model.get('type')} </span>
            </p>
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
          <span
            className={this.state.chevronIcon}
            onClick={this.handleDetailIconClick.bind(this, this.props.model.get('id'))}
          />
        </div>
        <div>
          {this.state.showDetails ?
            <AccountDetailContent model={this.props.model} accountDetailClassName={"details"}/>
            : false}
        </div>
      </li>
    );
  }
});

module.exports = Account;
