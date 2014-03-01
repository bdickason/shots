/* Tester for App */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should');

describe('userModel', function() {

  var User;

  beforeEach(function(done) {
    clientenv.setup(function() {
      console.log(appDir);
      UserModel = require(appDir + 'users/userModel.js');

      done();
    });
  });

  describe('loads', function() {
    it('loads', function() {
      should.exist(UserModel);
    });
  });
});

