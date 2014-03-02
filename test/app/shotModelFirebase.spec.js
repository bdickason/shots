/* Tester for App */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should'),
    sinon = require('sinon');

describe('shotModel', function() {

  var Shot;

  beforeEach(function(done) {
    clientenv.setup(function() {
      app.fbUrl = 'http://blah.firebaseio.com';
      ShotModelFirebase = require(appDir + 'shots/shotModelFirebase.js');
      // fbStub = sinon.stub(global, 'Firebase', function(fbRef, callback) {
        // callback();
      // });
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

    it('Properly constructs Firebase URL', function() {
      // Input
      
      shotModel = new ShotModelFirebase(input);
    
      spyCall = fbSpy.getCall(0);
      // console.log(spyCall);
    });
  });

  describe('toJSON', function() {
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

