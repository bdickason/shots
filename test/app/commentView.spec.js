/* Tester for Comment Model */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should');
    
describe('commentView', function() {

  var CommentModel;

  beforeEach(function(done) {
    clientenv.setup(function() {
      // CommentView = require('../../app/comments/commentView.js');
      // CommentModel = Backbone.Model;

      done();
    });
  });

  describe('initialize', function() {
    it('loads without errors', function() {
      should.exist(CommentView);
      // commentView = new CommentView();
      should.exist(commentView);
    });
  });
});