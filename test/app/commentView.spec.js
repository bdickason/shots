/* Tester for Comment View */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should'),
    fs = require('fs'),
    path = require('path'),
    sinon = require('sinon');
    
describe('commentView', function() {

  var CommentModel;

  beforeEach(function(done) {
    clientenv.setup(function() {
      
      // Pre-compile Handlebars template
      var Handlebars = require('handlebars');
      var templateFilename = path.resolve(__dirname, componentsDir + 'comments/commentTemplate.hbs');
      var commentTemplate = Handlebars.compile(templateFilename);

      // Setup objects
      CommentView = require(componentsDir + 'comments/commentView.js');
      CommentModel = Backbone.Model;  // Dummy model to pass into view

      done();
    });
  });

  describe('initialize', function() {
    it('loads without errors', function() {
      should.exist(CommentView);
      commentModel = new CommentModel({});
      var commentView = new CommentView({model: commentModel});
      should.exist(commentView);
    });
  });

  describe('render', function() {
    it('creates a list of comments with id', function() {
      // Input
      var id = 'test';

      commentModel = new CommentModel({id: id});
      var commentView = new CommentView({model: commentModel});

      commentModel.trigger('change'); // Grabbing data from firebase would trigger change event, forcing view to render()

      commentView.$el.children.length.should.equal(2);

      commentList = commentView.$el.find('li');
      should.exist(commentList);
      
      should.exist(commentList.attr('id'));
      commentList.attr('id').should.equal(id);
    });
  });

  describe('edit comments', function() {
    it('non-owner should not see edit/delete', function() {
      // Fake JSON output for model stub
      var fakeOutput = {};
      var commentModel = new CommentModel({});
      var commentStub = sinon.stub(commentModel, 'toJSON').returns(fakeOutput);

      commentModel.toJSON().should.equal(fakeOutput);

      var commentView = new CommentView({model: commentModel});
      commentModel.trigger('change'); // Render the view

      var comment = commentView.$el.find('li');
      comment.html().should.not.containEql('editComment');
      comment.html().should.not.containEql('cancelCommentEdit');
      comment.html().should.not.containEql('cancelCommentEdit');
      comment.html().should.not.containEql('saveComment');
      comment.html().should.not.containEql('deleteComment');

      commentStub.restore();
    });

    it('owner should see edit/delete for their own comments', function() {
      // Fake JSON output for model stub
      var fakeOutput = {
        owner: true
      };
      var commentModel = new CommentModel({});
      var commentStub = sinon.stub(commentModel, 'toJSON').returns(fakeOutput);

      commentModel.toJSON().should.equal(fakeOutput);

      var commentView = new CommentView({model: commentModel});
      commentModel.trigger('change'); // Render the view

      var comment = commentView.$el.find('li');
      comment.html().should.containEql('editComment');
      comment.html().should.containEql('cancelCommentEdit');
      comment.html().should.containEql('cancelCommentEdit');
      comment.html().should.containEql('saveComment');
      comment.html().should.containEql('deleteComment');

      commentStub.restore();
    });
  });


});