/* Tester for Comment Model */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should'),
    fs = require('fs'),
    path = require('path');
    
describe('commentView', function() {

  var CommentModel;

  beforeEach(function(done) {
    clientenv.setup(function() {
      // Pre-compile Handlebars template
      var templateFilename = path.resolve(__dirname, componentsDir + 'comments/commentTemplate.hbs');
      var commentTemplate = require('handlebars').compile(templateFilename);

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
});