/* Tester for App */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should'),
    sinon = require('sinon');

describe('userModel', function() {

  var User;

  beforeEach(function(done) {
    clientenv.setup(function() {
      UserModel = require(appDir + 'users/userModel.js');
      sinon.stub(global, 'Firebase');

      done();
    });
  });

  afterEach(function() {
    global.Firebase.restore();
  });

  describe('loads', function() {
    it('loads', function() {
      should.exist(UserModel);

      // console.log(Firebase);
      console.log(global.Firebase);

      userModel = new UserModel();
    });
  });
});

