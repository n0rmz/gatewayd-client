"use strict";

var React = require('react');

var FlowStep = React.createClass({

  getDefaultProps: function() {
    return {
      currentStep:'',
      step: false
    };
  },

  render: function() {
    return (
      <div>
        {this.props.step}
      </div>
    );
  }
});

module.export = FlowStep;
