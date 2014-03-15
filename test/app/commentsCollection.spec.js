/* Tester for Comments Collection */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should'),
    sinon = require('sinon');
    
describe('commentsCollectionFirebase', function() {

  var CommentsCollectionFirebase;

  beforeEach(function(done) {
    clientenv.setup(function() {
      CommentsCollectionFirebase = require(componentsDir + 'comments/commentsCollectionFirebase.js');

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
    it('when passed projectId and shotId, loads without errors', function() {
      // Input
      var input = {
        projectId: 'testProject',
        shotId: 'testShot'
      };
      
      should.exist(CommentsCollectionFirebase);

      fbSpy.calledOnce.should.be.false;
      commentsCollection = new CommentsCollectionFirebase([], input);
      should.exist(commentsCollection);
      fbSpy.calledOnce.should.be.true;
    });
  });

  describe('toJSON', function() {
    it('renders a proper timestamp', function() {
    });
  });

});

