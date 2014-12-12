var chai = require('chai');
var should = chai.should();
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.should();
chai.use(sinonChai);

var properPayment = require('./fixtures/successes');
var improperPayment = require('./fixtures/errors');

var Model = require('../models/payment');

var setUpSuccessfulModel = function() {
  this.model = new Model();

  this.model.set(properPayment.bob);
};

var setUpErroneousModel = function() {
  this.model = new Model();

  this.model.set(improperPayment.defaults);
};

describe('Payment Model:', function() {
  describe('validation', function() {
    describe('should pass when isValid', function() {
      beforeEach(setUpSuccessfulModel);

      it('is true', function() {
        this.model.isValid().should.equal(true);
      });
    });

    describe('should fail when isValid', function() {
      beforeEach(setUpErroneousModel);

      it('is false', function() {
        this.model.isValid().should.equal(false);
      });
    });
  });

  describe('should have required attributes:', function() {
    beforeEach(setUpSuccessfulModel);

    it('has source account id', function() {
      this.model.get('source_account_id').should.exist;
    });

    it('has source amount', function() {
      this.model.get('source_amount').should.exist;
    });

    it('has source currency', function() {
      this.model.get('source_currency').should.exist;
    });

    it('has destination account id', function() {
      this.model.get('destination_account_id').should.exist;
    });

    it('has destination amount', function() {
      this.model.get('destination_amount').should.exist;
    });

    it('has destination currency', function() {
      this.model.get('destination_currency').should.exist;
    });

    it('has deposit', function() {
      this.model.get('deposit').should.exist;
    });

    it('has external_account_id', function() {
      this.model.get('external_account_id').should.exist;
    });
  });
});





