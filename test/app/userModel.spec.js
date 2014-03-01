/* Tester for App */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should'),
    sinon = require('sinon');

describe('userModel', function() {

  var User;

  beforeEach(function(done) {
    clientenv.setup(function() {
      UserModel = require(appDir + 'users/userModel.js');
      sinon.stub(Firebase, 'initialize');

      done();
    });
  });

  afterEach(function() {
    Firebase.initialize.restore();
  });

  describe('loads', function() {
    it('loads', function() {
      should.exist(UserModel);

      // console.log(Firebase);
      console.log(Firebase);

      userModel = new UserModel();
    });
  });
});

