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
      var templateFilename = path.resolve(__dirname, componentsDir + 'shots/show/shotShowTemplate.hbs');

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
      ShotView = require(componentsDir + 'shots/show/shotShowView.js');
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

  describe('edit shots', function() {
    it('non-owner should not see edit/delete', function() {
      // Fake JSON output for model stub
      var fakeOutput = {};
      var shotModel = new ShotModel({});
      var shotStub = sinon.stub(shotModel, 'toJSON').returns(fakeOutput);

      shotModel.toJSON().should.equal(fakeOutput);

      var shotView = new ShotView({model: shotModel});
      shotModel.trigger('change'); // Render the view

      var shot = shotView.$el;

      shot.html().should.not.containEql('shotSettings');
      shot.html().should.not.containEql('editShot');
      shot.html().should.not.containEql('cancelShotEdit');
      shot.html().should.not.containEql('cancelShotEdit');
      shot.html().should.not.containEql('saveShot');
      shot.html().should.not.containEql('deleteShot');

      shotStub.restore();
    });

    it('owner should see edit/delete for their own shots', function() {
      // Fake JSON output for model stub
      var fakeOutput = {
        owner: true
      };
      var shotModel = new ShotModel({});
      var shotStub = sinon.stub(shotModel, 'toJSON').returns(fakeOutput);

      shotModel.toJSON().should.equal(fakeOutput);

      var shotView = new ShotView({model: shotModel});
      shotModel.trigger('change'); // Render the view

      var shot = shotView.$el.find('.shotSettings');
      shot.html().should.containEql('editShot');
      shot.html().should.containEql('cancelShotEdit');
      shot.html().should.containEql('cancelShotEdit');
      shot.html().should.containEql('saveShot');
      shot.html().should.containEql('deleteShot');

      shotStub.restore();
    });
  });

  describe('delete shots', function() {
 
    it('owner can delete their own shot', function() {
      // Input
      var input = {
        projectId: 'fakeProject'
      };

      // Fake JSON output for model stub
      var fakeOutput = {
        owner: true
      };

      var shotModel = new ShotModel(input);
      var shotStub = sinon.stub(shotModel, 'toJSON').returns(fakeOutput);

      var Router = Backbone.Router.extend({});
      app.router = new Router();
      var routerStub = sinon.stub(app.router, 'navigate');

      var shotView = new ShotView({model: shotModel});
      shotModel.trigger('change'); // Render the view

      var deleteButton = shotView.$el.find('#deleteShot');
      deleteButton.trigger('click');

      // Make sure user is redirected to project
      var fakeRoute = '/' + input.projectId;

      routerStub.calledOnce.should.be.true;
      routerStub.getCall(0).args[0].should.eql(fakeRoute);
      routerStub.getCall(0).args[1].should.eql({trigger: true});
  
      shotStub.restore();
      routerStub.restore();
    });
  });


});