/* Tester for Comment Card List View 
  
    Displays the number of comments on an item */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should'),
    sinon = require('sinon'),
    fs = require('fs'),
    path = require('path');
    
describe('commentListCardView', function() {

  var CommentsCollection,
      CommentModel;

  beforeEach(function(done) {
    clientenv.setup(function() {
      // Pre-compile Handlebars template
      var templateFilename = path.resolve(__dirname, componentsDir + 'comments/list/commentListCardTemplate.hbs');

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
      CommentsCardView = require(componentsDir + 'comments/list/commentListCardView.js');
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
      should.exist(CommentsCardView);
      commentsCollection = new CommentsCollection([]);
      commentsCardView = new CommentsCardView({ collection: commentsCollection });
      should.exist(commentsCardView);
    });
  });

  describe('render', function() {
    it('displays a count of Comments', function() {
      // Input
      var input = {
        id: 'testComment',
        projectId: 'testProject'
      };

      commentsCollection = new CommentsCollection([]);
      commentsCardView = new CommentsCardView({ collection: commentsCollection });

      commentModel = new CommentModel(input);
      commentsCollection.push(commentModel);

      should.exist(commentsCardView.$el);

      count = commentsCardView.$el.html();

      count.should.containEql('1 Comment');
    });
  });

});