/* Tester for Comment View */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should'),
    sinon = require('sinon');
    
describe('userModel', function() {

  var UserModel;

  beforeEach(function(done) {
    clientenv.setup(function() {
      // Setup objects
      UserModel = require(componentsDir + 'users/models/userModelFirebase.js');

      app.fbUrl = 'http://www.blah.com';
      // Stub external libraries
      fbSpy = sinon.spy(global, 'Firebase');

      done();
    });
  });

  afterEach(function() {
    fbSpy.restore();
  });


  describe('initialize', function() {
    it('loads without errors', function() {
      should.exist(UserModel);
      userModel = new UserModel({});
      should.exist(userModel);
    });
  });
});