/* Tester for Comment View */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should'),
    fs = require('fs'),
    path = require('path');
    
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
      commentView = new CommentView({model: commentModel});
      should.exist(commentView);
    });
  });

  describe('render', function() {
    it('creates a list of comments with id', function() {
      // Input
      var id = 'test';

      commentModel = new CommentModel({id: id});
      commentView = new CommentView({model: commentModel});

      commentModel.trigger('change'); // Grabbing data from firebase would trigger change event, forcing view to render()

      commentView.$el.children.length.should.equal(2);

      commentList = commentView.$el.find('li');
      should.exist(commentList);
      
      should.exist(commentList.attr('id'));
      commentList.attr('id').should.equal(id);
    });
  });

});