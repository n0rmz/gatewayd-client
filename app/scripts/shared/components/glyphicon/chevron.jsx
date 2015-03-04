'use strict';

var _ = require('lodash');
var React = require('react');

var Chevron = React.createClass({
  propTypes: {
    clickHandler: React.PropTypes.func,
    iconClasses: React.PropTypes.string
  },

  iconMap: {
    up: 'glyphicon glyphicon-chevron-up',
    down: 'glyphicon glyphicon-chevron-down'
  },

  reversal: {
    up: 'down',
    down: 'up'
  },

  handleClick: function() {
    this.setState({
      direction: this.reversal[this.state.direction]
    });

    this.props.clickHandler();
  },

  getInitialState: function() {
    return {
      direction: 'down'
    };
  },

  classBuilder: function() {
    if (_.isEmpty(this.props.iconClasses)) {
      return iconMap[this.state.direction];
    }

    return this.props.iconClasses + ' ' + this.iconMap[this.state.direction];
  },

  render: function() {
    return (
      <span
        className={this.classBuilder()}
        onClick={this.handleClick}
      />
    );
  }
});

module.exports = Chevron;
