/* Tester for Comment Model */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should');

describe('commentModel', function() {

  var CommentModel;

  beforeEach(function(done) {
    clientenv.setup(function() {
      CommentModel = require(appDir + 'comments/commentModel.js');

      done();
    });
  });

  describe('initialize', function() {
    it('loads without errors', function() {
      should.exist(CommentModel);
      commentModel = new CommentModel();
      should.exist(commentModel);
    });
  });

  describe('toJSON', function() {
    it('renders a proper timestamp', function() {
      // input
      var input = {
        text: 'This is a comment',
        user: 'username',
        timestamp: new Date()
      };

      commentModel = new CommentModel(input);

      output = commentModel.toJSON();

      should.exist(output.timestamp);
      should.exist(output.time);
      output.time.should.equal('a few seconds ago');
    });
  });

});

