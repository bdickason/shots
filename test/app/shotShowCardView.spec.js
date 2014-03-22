/* Tester for Shot View */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should'),
    fs = require('fs'),
    path = require('path'),
    sinon = require('sinon');
    
describe('shotView', function() {

  var ShotModel;

  beforeEach(function(done) {
    clientenv.setup(function() {
      
      // Pre-compile Handlebars template
      var templateFilename = path.resolve(__dirname, componentsDir + 'shots/show/shotShowCardTemplate.hbs');

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

      shotTemplate = Handlebars.compile(templateFilename);

      // Setup objects
      ShotView = require(componentsDir + 'shots/show/shotShowCardView.js');
      ShotModel = Backbone.Model;  // Dummy model to pass into view

      done();
    });
  });

  describe('initialize', function() {
    it('loads without errors', function() {
      should.exist(ShotView);
      shotModel = new ShotModel({});
      shotView = new ShotView({model: shotModel});
      should.exist(shotView);
    });
  });

  describe('render', function() {
    it('displays a shot with id', function() {
      // Input
      var input = {
        id: 'testShot',
        projectId: 'testProject'
      };

      shotModel = new ShotModel(input);
      shotView = new ShotView({model: shotModel});

      shotModel.trigger('change'); // Grabbing data from firebase would trigger change event, forcing view to render()

      shotView.$el.children.length.should.equal(2);
    });
  });
});