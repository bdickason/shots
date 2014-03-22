/* Tester for Comment Model */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should');
    
describe('commentModel', function() {

  var CommentModel;

  beforeEach(function(done) {
    clientenv.setup(function() {
      CommentModel = require(componentsDir + 'comments/models/commentModel.js');

      done();
    });
  });

  describe('initialize', function() {
    it('loads without errors', function() {
      should.exist(CommentModel);
      var commentModel = new CommentModel();
      should.exist(commentModel);
    });
  });

  describe('toJSON', function() {
    it('Sets the owner flag to true if the current user is the owner', function() {
      // Input
      var input = {
        text: 'My fancy comment',
        user: 'bob'
      };

      // 'Log in' the current user
      app.user = new Backbone.Model({});
      app.user.set('username', input.user);

      var commentModel = new CommentModel(input);

      var output = commentModel.toJSON();

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

      var commentModel = new CommentModel(input);

      var output = commentModel.toJSON();

      should.not.exist(output.owner);
    });

    it('Does not set the owner flag if the current user is signed out', function() {
      // Input
      var input = {
        text: 'My fancy comment',
        user: 'bob'
      };

      app.user = new Backbone.Model({});

      var commentModel = new CommentModel(input);

      var output = commentModel.toJSON();

      should.not.exist(output.owner);
    });

    it('renders a proper timestamp', function() {
      // input
      var input = {
        text: 'This is a comment',
        user: 'username',
        timestamp: new Date()
      };

      app.user = new Backbone.Model({});

      var commentModel = new CommentModel(input);

      var output = commentModel.toJSON();


      should.exist(output.timestamp);
      should.exist(output.time);
      output.time.should.equal('a few seconds ago');
    });
  });

});

