/* Tester for App */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should');

describe('userModel', function() {

  beforeEach(function(done) {
    clientenv.setup(function() {
      Backbone = window.Backbone;
      _ = window._;
      done();
    });
  });

  describe('loads', function() {
    it('loads', function() {
      var UserModel = require('../../app/users/userModel.js');
      should.exist(userModel);
      // console.log(userModel);
    });
  });
});

