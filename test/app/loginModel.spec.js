/* Tester for App */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should'),
    sinon = require('sinon');

describe('loginModel', function() {

  var User, LoginModel, fbStub, loginStub;

  beforeEach(function(done) {
    clientenv.setup(function() {
      app.fbUrl = 'http://blah.firebaseio.com';
      LoginModel = require(componentsDir + 'users/models/loginModel.js');

      fbStub = sinon.stub(global, 'Firebase');
      loginStub = sinon.stub(global, 'FirebaseSimpleLogin');
      userStub = sinon.stub(LoginModel.prototype, 'saveUser');

      done();
    });
  });

  afterEach(function() {
    fbStub.restore();
    loginStub.restore();
    userStub.restore();
  });

  describe('loads the model', function() {
    it('without errors', function() {
      should.exist(LoginModel);

      loginModel = new LoginModel();

      // userStub.restore();
      should.exist(loginModel);
    });
  });

  describe('connects to Firebase', function() {
    it('loads Firebase with a URL', function() {
      app.fbUrl = 'http://blah.com';
      
      fbStub.calledOnce.should.be.false;
      loginModel = new LoginModel();

      fbStub.calledOnce.should.be.true;
      fbStub.getCall(0).args[0].should.equal(app.fbUrl);  // Firebsae has been called w/ URL
    });

    it('loads Firebase-Simple-Login', function() {
      loginStub.calledOnce.should.be.false;
      loginModel = new LoginModel();
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

      loginModel = new LoginModel();

      input.displayName.should.equal(loginModel.get('displayName'));
      input.profile_image_url_https.should.equal(loginModel.get('profileImage'));
      should.exist(loginModel.get('lastLogin')); // Time is not always synced
      input.username.should.equal(loginModel.get('username'));
      input.loggedIn.should.equal(loginModel.get('loggedIn'));
    });

    it("Should save the user's information", function() {
      // Input
      var input = {
        displayName: 'User Name',
        profile_image_url_https: 'http://blah.com/img.jpg',
        lastLogin: new Date(),
        username: 'username',
        loggedIn: true
      };

      loginStub.yields(null, input);  // FirebaseSimpleLogin will generate a callback which contains these two parameters

      loginModel = new LoginModel();

      userStub.called.should.be.true;

      userStub.getCall(0).args[0].displayName.should.eql(input.displayName);
      userStub.getCall(0).args[0].profileImage.should.eql(input.profile_image_url_https);
      userStub.getCall(0).args[0].lastLogin.should.eql(input.lastLogin);
      userStub.getCall(0).args[0].username.should.eql(input.username);

      // console.log(userStub.Calls);
    });

    it('User can log out', function() {
      // loginModel.logout successfully triggers FirebaseSimpleLogin.logout()

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
      loginModel = new LoginModel(input);

      logoutSpy = sinon.spy(loginStub);

      loginModel.logout();
    });
  });
});

