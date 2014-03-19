/* Tester for App */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should'),
    sinon = require('sinon');

describe('loginModel', function() {

  var User, UserModel, fbStub, loginStub;

  beforeEach(function(done) {
    clientenv.setup(function() {
      UserModel = require(componentsDir + 'users/loginModel.js');

      fbStub = sinon.stub(global, 'Firebase');
      loginStub = sinon.stub(global, 'FirebaseSimpleLogin');
      
      done();
    });
  });

  afterEach(function() {
    fbStub.restore();
    loginStub.restore();
  });

  describe('loads the model', function() {
    it('without errors', function() {
      should.exist(UserModel);

      userModel = new UserModel();
      should.exist(userModel);
    });
  });

  describe('connects to Firebase', function() {
    it('loads Firebase with a URL', function() {
      app.fbUrl = 'http://blah.com';
      
      fbStub.calledOnce.should.be.false;
      userModel = new UserModel();

      fbStub.calledOnce.should.be.true;
      fbStub.getCall(0).args[0].should.equal(app.fbUrl);  // Firebsae has been called w/ URL
    });

    it('loads Firebase-Simple-Login', function() {
      loginStub.calledOnce.should.be.false;
      userModel = new UserModel();
      loginStub.calledOnce.should.be.true;  // Auth has been called
    });

  });

  describe('User signed out', function() {
    it('User can login', function() {
    });
  });

  describe('User signed in', function() {
    it('Should remain logged in', function() {
      // Input
      var input = {
        displayName: 'User Name',
        profile_image_url_https: 'http://blah.com/img.jpg',
        lastLogin: new Date(),
        username: 'username',
        loggedIn: true
      };

      loginStub.yields(null, input);  // FirebaseSimpleLogin will generate a callback which contains these two parameters

      userModel = new UserModel();

      input.displayName.should.equal(userModel.get('displayName'));
      input.profile_image_url_https.should.equal(userModel.get('profileImage'));
      should.exist(userModel.get('lastLogin')); // Time is not always synced
      input.username.should.equal(userModel.get('username'));
      input.loggedIn.should.equal(userModel.get('loggedIn'));
    });

    it('User can log out', function() {
      // userModel.logout successfully triggers FirebaseSimpleLogin.logout()

      // stub out app.auth.logout
      loginStub.prototype.logout = function() {
        // Fake out logout actions (wipe user)
      };
      
      //Input
      var input = {
        displayName: 'User Name',
        profile_image_url_https: 'http://blah.com/img.jpg',
        lastLogin: new Date(),
        username: 'username',
        loggedIn: true
      };

      // Create a new model as if we were logged in
      userModel = new UserModel(input);

      logoutSpy = sinon.spy(loginStub);

      userModel.logout();
      // slogoutSpy.calledOnce.should.equal(true);
    });
  });
});

