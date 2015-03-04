var chai = require('chai');
var should = chai.should();
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.should();
chai.use(sinonChai);

var properAccount = require('./fixtures/successes');
var improperAccount = require('./fixtures/errors');

var Model = require('../models/account');

var setUpSuccessfulModel = function() {
  this.model = new Model();

  this.model.set(properAccount.bob);
};

var setUpErroneousModel = function() {
  this.model = new Model();

  this.model.set(improperAccount.defaults);
};

describe('Account Model:', function() {
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

    it('has address', function() {
      this.model.get('address').should.exist;
    });

    it('has type', function() {
      this.model.get('type').should.exist;
    });
  });
});





