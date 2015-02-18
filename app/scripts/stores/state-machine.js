'use strict';

var Morearty = require('morearty');
var Reflux = require('reflux');
var ActionCreators = require('../actions/ActionCreators');

var StateMachineStore = Reflux.createStore({

  listenables: ActionCreators,

  init: function() {
    this.rootBinding = this.getMoreartyContext().getBinding();
    this.stateMachineBinding = this.rootBinding.sub('stateMachine');
  },

  onIncrementStep: function() {
    this.stateMachineBinding
      .atomically()
      .set('activeStep', this.stateMachineBinding.get('activeStep') + 1)
      .commit();
  }
});

module.exports = StateMachineStore;
