/* Tester for Comments View */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should'),
    sinon = require('sinon'),
    fs = require('fs'),
    path = require('path');
    
describe('commentListView', function() {

  var CommentsCollection,
      CommentModel;

  beforeEach(function(done) {
    clientenv.setup(function() {
      // Pre-compile Handlebars template
      var templateFilename = path.resolve(__dirname, componentsDir + 'comments/list/commentListTemplate.hbs');

      var Handlebars = require('handlebars');

      // Handlebars hack because app.utils uses a different version of handlebars
      Handlebars.registerHelper('pluralize', function(number, singular, plural) {
          // Handlebars helper for plural variables
          // Use: {{pluralize object 'single_string' 'plural_string'}}
          //
          // Example: "0 comments" vs. "1 comment" vs. "5 comments"
          // {{pluralize this.length "comment" "comments" }}
          // Assumes the collection is being loaded as 'this'

          switch(number) {
              case 0:
                  return(plural);
              case 1:
                  return(singular);
              default:
                  return(plural);
          }
      });

      commentsTemplate = Handlebars.compile(templateFilename);

      // Stubs
      // Backbone will call 'sync' when adding a model to our collection if we don't override this
      syncStub = sinon.stub(Backbone.Model.prototype, 'sync');

      // Objects
      CommentsView = require(componentsDir + 'comments/list/commentListView.js');
      CommentsCollection = Backbone.Collection;  // Dummy collection to pass into view
      CommentModel = Backbone.Model;             // Dummy model to pass into view

      done();
    });
  });

  afterEach(function(done) {
    // Restore our stub to its original
    syncStub.restore();
    done();
  });

  describe('initialize', function() {
    it('loads without errors', function() {
      should.exist(CommentsView);
      commentsCollection = new CommentsCollection([]);
      commentsView = new CommentsView({ collection: commentsCollection });
      should.exist(commentsView);
    });
  });

  describe('render', function() {
    it('displays a list of Comments', function() {
      // Input
      var input = {
        id: 'testComment',
        projectId: 'testProject'
      };

      commentsCollection = new CommentsCollection([]);
      commentsView = new CommentsView({ collection: commentsCollection });

      commentModel = new CommentModel(input);
      commentsCollection.push(commentModel);

      should.exist(commentsView.$el);
    });
  });

 describe('create', function() {

    it('Should start with an empty list of comments', function() {
      var projectId = 'testProject';  // Usually passed to the view from the URL
      
      // Setup fake collection
      commentsCollection = new CommentsCollection([]);

      commentsView = new CommentsView({ collection: commentsCollection, project: projectId });

      commentsCollection.trigger('sync');  // Sync event from collection causes view to render
      
      commentsView.$el.html().length.should.be.greaterThan(0);

      var comments = commentsView.$el.find('ul.comments');
      comments.html().should.not.include('<li>'); // No comment items in the list    
    });

    it('A signed-in user can create a comment', function() {
      // Input
      var input = {
        text: 'testing a comment'
      };

      var userData = {
        displayName: 'Test User',
        profileImage: 'http://images.com/img.jpg',
        lastLogin: new Date(),
        username: 'testuser',
        loggedIn: true
      };

      app.user = new Backbone.Model(userData);

      var projectId = 'testProject';  // Usually passed to the view from the URL
      
      // Setup fake collection
      commentsCollection = new CommentsCollection([]);

      commentsView = new CommentsView({ collection: commentsCollection, project: projectId });

      commentsCollection.trigger('sync');  // Sync event from collection causes view to render

      var comments = commentsView.$el.find('ul.comments');

      var textField = commentsView.$el.find('textarea#text');
      textField.length.should.equal(1);   // Make sure the dom element exists
      textField.val(input.text);

      createCommentButton = commentsView.$el.find('button#createComment');
      createCommentButton.trigger('click');

      commentsCollection.length.should.be.greaterThan(0);

      var comment = commentsCollection.first();
      should.exist(comment);
      comment.get('text').should.equal(input.text);
      comment.get('user').should.equal(app.user.get('username'));
      should.exist(comment.get('timestamp'));
    });

    it('A signed-out user can not create a comment', function() {
      // Input
      var input = {
        text: 'testing a comment'
      };

      app.user = new Backbone.Model({});

      var projectId = 'testProject';  // Usually passed to the view from the URL
      
      // Setup fake collection
      commentsCollection = new CommentsCollection([]);

      commentsView = new CommentsView({ collection: commentsCollection, project: projectId });

      commentsCollection.trigger('sync');  // Sync event from collection causes view to render

      var comments = commentsView.$el.find('ul.comments');

      var textField = commentsView.$el.find('textarea#text');
      textField.length.should.equal(1);   // Make sure the dom element exists
      textField.val(input.text);

      var createCommentButton = commentsView.$el.find('button#createComment');
      createCommentButton.trigger('click');

      // Collection should not have any objects
      commentsCollection.length.should.equal(0);

      var error = commentsView.$el.find('#commentsError');
      should.exist(error);
      error.text().length.should.be.greaterThan(0);
      error.text().should.equal('Sorry, you must be logged in');
    });
  });
});