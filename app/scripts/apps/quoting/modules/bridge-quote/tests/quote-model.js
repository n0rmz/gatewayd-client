var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.should();
chai.use(sinonChai);

var properQuote = require('./fixtures/successes');
var improperQuote = require('./fixtures/errors');

var Model = require('../models/quote');

var setUpSuccessfulModel = function() {
  this.model = new Model();

  this.model.set(properQuote);
};

var setUpErroneousModel = function() {
  this.model = new Model();

  this.model.set(improperQuote);
};

describe('Quote Model:', function() {

  describe('validation', function() {
    describe('should pass when isValid', function() {
      beforeEach(setUpSuccessfulModel);

      it('is true', function() {
        this.model.isValid().should.equal(true);
      });
    });
  });

  describe('should have required attributes:', function() {
    beforeEach(setUpSuccessfulModel);

    it('has bridge_payment that contains fields', function() {
      this.model.get('bridge_payments').should.exist;

      var bridge_payments = this.model.get('bridge_payments');

      expect(bridge_payments.length > 0).to.be.true;

      var payment = bridge_payments[0];

      payment['state'].should.exist;
      payment['created'].should.exist;
      payment['source'].should.exist;
      payment['wallet_payment'].should.exist;
      payment['destination'].should.exist;
      payment['destination_amount'].should.exist;
      payment['parties'].should.exist;
      payment['uuid'].should.exist;

    });
  });
});
