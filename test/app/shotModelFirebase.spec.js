/* Tester for App */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should'),
    sinon = require('sinon');

describe('shotModel', function() {

  var Shot;

  beforeEach(function(done) {
    clientenv.setup(function() {
      app.fbUrl = 'http://blah.firebaseio.com';
      ShotModelFirebase = require(componentsDir + 'shots/models/shotModelFirebase.js');
      
      fbSpy = sinon.spy(global, 'Firebase');

      done();
    });
  });

  afterEach(function() {
    fbSpy.restore();
    // fbStub.restore();
  });

  describe('loads the model', function() {
    it('without errors', function() {
      should.exist(ShotModelFirebase);
      shotModel = new ShotModelFirebase();
      should.exist(shotModel);
    });
  });

  describe('connects to Firebase', function() {
    it('Properly constructs Firebase URL', function() {
      // Input
      
      input = {
        id: 0,
        projectId: 'test'
      };

      shotModel = new ShotModelFirebase(input);
      should.exist(shotModel);
      var url = app.fbUrl + '/shots/' + input.projectId + '/' + input.id;
      
      spyCall = fbSpy.getCall(0);
      spyCall.args[0].should.equal(url);  // URL is constructed
    });
  });

  describe('toJSON', function() {
    it('Sets the owner flag to true if the current user is the owner', function() {
      // Input
      var input = {
        text: 'My fancy shot',
        user: 'bob'
      };

      // 'Log in' the current user
      app.user = new Backbone.Model({});
      app.user.set('username', input.user);

      var shotModel = new ShotModelFirebase(input);

      var output = shotModel.toJSON();

      should.exist(output.owner);
      output.owner.should.be.true;
    });

    it('Does not set the owner flag if the current user is not the owner', function() {
      // Input
      var input = {
        text: 'My fancy comment',
        user: 'bob'
      };

      // 'Log in' another user
      app.user = new Backbone.Model({});
      app.user.set('username', 'bilbo baggins');

      var shotModel = new ShotModelFirebase(input);

      var output = shotModel.toJSON();

      should.not.exist(output.owner);
    });

    it('Does not set the owner flag if the current user is signed out', function() {
      // Input
      var input = {
        text: 'My fancy comment',
        user: 'bob'
      };

      app.user = new Backbone.Model({});

      var shotModel = new ShotModelFirebase(input);

      var output = shotModel.toJSON();

      should.not.exist(output.owner);
    });

    it('renders a proper timestamp', function() {
      // input
      var input = {
        text: 'This is a shot comment',
        image: 'This is a sample image',
        user: 'username',
        timestamp: new Date()
      };

      shotModel = new ShotModelFirebase(input);

      output = shotModel.toJSON();

      should.exist(output.timestamp);
      should.exist(output.time);
      output.time.should.equal('a few seconds ago');
    });
  });
});

