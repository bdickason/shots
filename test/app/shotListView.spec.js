/* Tester for Shots View */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should'),
    sinon = require('sinon'),
    fs = require('fs'),
    path = require('path');
    
describe('shotsListView', function() {

  var ShotsCollection,
      ShotModel;

  beforeEach(function(done) {
    clientenv.setup(function() {
      
      // Pre-compile Handlebars template
      var templateFilename = path.resolve(__dirname, componentsDir + 'shots/list/shotsListTemplate.hbs');

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

      shotsTemplate = Handlebars.compile(templateFilename);

      // Stubs
      // Backbone will call 'sync' when adding a model to our collection if we don't override this
      syncStub = sinon.stub(Backbone.Model.prototype, 'sync');

      // Objects
      ShotsView = require(componentsDir + 'shots/list/shotsListView.js');
      ShotsCollection = Backbone.Collection;  // Dummy collection to pass into view
      ShotModel = Backbone.Model;             // Dummy model to pass into view

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
      should.exist(ShotsView);
      shotsCollection = new ShotsCollection([]);
      shotsView = new ShotsView({ collection: shotsCollection });
      should.exist(shotsView);
    });
  });

  describe('render', function() {
    it('displays a list of Shots', function() {
      // Input
      var input = {
        id: 'testShot',
        projectId: 'testProject'
      };

      shotsCollection = new ShotsCollection([]);
      shotsView = new ShotsView({ collection: shotsCollection });

      shotModel = new ShotModel(input);
      shotsCollection.push(shotModel);

      should.exist(shotsView.$el);
    });
  });

  describe('new', function() {

    var newButton,
        newShotView;

    beforeEach(function(done) {
      var projectId = 'testProject';  // Usually passed to the view from the URL
      
      // Setup fake collection
      shotsCollection = new ShotsCollection([]);

      shotsView = new ShotsView({ collection: shotsCollection, project: projectId });

      shotsCollection.trigger('sync');  // Sync event from collection causes view to render

      newButton = shotsView.$el.find('#newShot');
      newShotView = shotsView.$el.find('.newShotView');

      done();
    });

    it('Should show the New Button', function() {
      newButton.html().length.should.be.greaterThan(0);
    });

    it('Should hide the Create dialog by default', function() {
      newShotView.css('display').should.eql('none');
    });
  });

  describe('create', function() {

    it('Should start with an empty list of shots', function() {
      var projectId = 'testProject';  // Usually passed to the view from the URL
      
      // Setup fake collection
      shotsCollection = new ShotsCollection([]);

      shotsView = new ShotsView({ collection: shotsCollection, project: projectId });

      shotsCollection.trigger('sync');  // Sync event from collection causes view to render
      
      shotsView.$el.html().length.should.be.greaterThan(0);

      var shots = shotsView.$el.find('ul.shots');
      shots.html().should.not.include('<li>'); // No shot items in the list    
    });

    it('A signed-in user can create a shot', function() {
      // Input
      var input = {
        image: 'http://blah.com/image.jpg',
        text: 'testing a shot'
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
      shotsCollection = new ShotsCollection([]);

      shotsView = new ShotsView({ collection: shotsCollection, project: projectId });

      shotsCollection.trigger('sync');  // Sync event from collection causes view to render

      var shots = shotsView.$el.find('ul.shots');

      // Add image input to form
      var imageField = shotsView.$el.find('input#image');
      imageField.length.should.equal(1);  // Make sure the dom element exists
      imageField.val(input.image);

      var textField = shotsView.$el.find('textarea#text');
      textField.length.should.equal(1);   // Make sure the dom element exists
      textField.val(input.text);

      createShotButton = shotsView.$el.find('button#createShot');
      createShotButton.trigger('click');

      shotsCollection.length.should.be.greaterThan(0);

      var shot = shotsCollection.first();
      should.exist(shot);
      shot.get('text').should.equal(input.text);
      shot.get('image').should.equal(input.image);
      shot.get('user').should.equal(app.user.get('username'));
      should.exist(shot.get('timestamp'));
      shot.get('projectId').should.equal(projectId);
    });

    it('A signed-out user can not create a shot', function() {
      // Input
      var input = {
        image: 'http://blah.com/image.jpg',
        text: 'testing a shot'
      };

      app.user = new Backbone.Model({});

      var projectId = 'testProject';  // Usually passed to the view from the URL
      
      // Setup fake collection
      shotsCollection = new ShotsCollection([]);

      shotsView = new ShotsView({ collection: shotsCollection, project: projectId });

      shotsCollection.trigger('sync');  // Sync event from collection causes view to render

      var shots = shotsView.$el.find('ul.shots');

      // Add image input to form
      var imageField = shotsView.$el.find('input#image');
      imageField.length.should.equal(1);  // Make sure the dom element exists
      imageField.val(input.image);

      var textField = shotsView.$el.find('textarea#text');
      textField.length.should.equal(1);   // Make sure the dom element exists
      textField.val(input.text);

      var createShotButton = shotsView.$el.find('button#createShot');
      createShotButton.trigger('click');

      // Collection should not have any objects
      shotsCollection.length.should.equal(0);

      var error = shotsView.$el.find('#shotsError');
      should.exist(error);
      error.text().length.should.be.greaterThan(0);
      error.text().should.equal('Sorry, you must be logged in');

    });

  });
});