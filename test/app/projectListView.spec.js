/* Tester for Project List View */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should'),
    sinon = require('sinon'),
    fs = require('fs'),
    path = require('path');
    
describe('projectListView', function() {

  var ProjectsCollection,
      ProjectModel;

  beforeEach(function(done) {
    clientenv.setup(function() {
      
      // Pre-compile Handlebars template
      var templateFilename = path.resolve(__dirname, componentsDir + 'projects/list/projectListTemplate.hbs');

      var Handlebars = require('handlebars');

      // Handlebars hack because app.utils uses a different version of handlebars
      Handlebars.registerHelper('pluralize', function(number, singular, plural) {
          // Handlebars helper for plural variables
          // Use: {{pluralize object 'single_string' 'plural_string'}}
          //
          // Example: "0 projects" vs. "1 project" vs. "5 projects"
          // {{pluralize this.length "project" "projects" }}
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

      projectsTemplate = Handlebars.compile(templateFilename);

      // Stubs
      // Backbone will call 'sync' when adding a model to our collection if we don't override this
      syncStub = sinon.stub(Backbone.Model.prototype, 'sync');

      // Objects
      ProjectListView = require(componentsDir + 'projects/list/projectListView.js');
      ProjectsCollection = Backbone.Collection;  // Dummy collection to pass into view
      ProjectModel = Backbone.Model;             // Dummy model to pass into view

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
      should.exist(ProjectListView);
      projectsCollection = new ProjectsCollection();
      projectListView = new ProjectListView({ collection: projectsCollection });
      should.exist(projectListView);
    });
  });

  describe('render', function() {
    it('displays a list of Projects', function() {
      // Input
      var input = {
        id: 'testProject',
        projectId: 'testProject'
      };

      projectsCollection = new ProjectsCollection();
      projectListView = new ProjectListView({ collection: projectsCollection });

      projectModel = new ProjectModel(input);
      projectsCollection.push(projectModel);

      should.exist(projectListView.$el);
    });

    it('adds a class to a Project when selected', function() {
      // Input
      var input = {
        id: 'testProject',
        projectId: 'testProject'
      };

      projectsCollection = new ProjectsCollection();

      // Passing in an ID explicitly selects a project
      projectListView = new ProjectListView({ collection: projectsCollection, id: 'testProject' });

      projectModel = new ProjectModel(input);
      projectsCollection.push(projectModel);

      projectsCollection.trigger('sync');  // Sync event from collection causes view to render

      var selectedProject = projectListView.$el.find('li#testProject');

      selectedProject.attr('class').should.containEql('selected');
    });

    it('does not add a class to unselected Projects', function() {
      // Input
      var input = {
        id: 'testProject',
        projectId: 'testProject'
      };

      projectsCollection = new ProjectsCollection();

      // No ID passed in
      projectListView = new ProjectListView({ collection: projectsCollection });

      projectModel = new ProjectModel(input);
      projectsCollection.push(projectModel);

      projectsCollection.trigger('sync');  // Sync event from collection causes view to render

      var selectedProject = projectListView.$el.find('li#testProject');
      
      selectedProject.attr('class').should.not.containEql('selected');
    });
  });

 describe('create', function() {

    it('Should start with an empty list of projects', function() {
      var projectId = 'testProject';  // Usually passed to the view from the URL
      
      // Setup fake collection
      projectsCollection = new ProjectsCollection();

      projectListView = new ProjectListView({ collection: projectsCollection, project: projectId });

      projectsCollection.trigger('sync');  // Sync event from collection causes view to render
      
      projectListView.$el.html().length.should.be.greaterThan(0);

      var projects = projectListView.$el.find('ul.projects');
      projects.html().should.not.include('<li>'); // No project items in the list    
    });

    it('A signed-in user can create a project', function() {
      // Input
      var input = {
        name: 'Test Project'
      };

      var userData = {
        displayName: 'Test User',
        profileImage: 'http://images.com/img.jpg',
        lastLogin: new Date(),
        username: 'testuser',
        loggedIn: true
      };

      app.user = new Backbone.Model(userData);
      
      // Setup fake collection
      projectsCollection = new ProjectsCollection();

      projectListView = new ProjectListView({ collection: projectsCollection });

      projectsCollection.trigger('sync');  // Sync event from collection causes view to render

      var projects = projectListView.$el.find('ul.projects');

      var nameField = projectListView.$el.find('#name');
      nameField.length.should.equal(1);   // Make sure the dom element exists
      nameField.val(input.name);

      var createProjectButton = projectListView.$el.find('button#createProject');
      createProjectButton.trigger('click');

      projectsCollection.length.should.be.greaterThan(0);
      
      var project = projectsCollection.first();
      should.exist(project);
      project.get('id').should.equal(input.name);
      project.get('user').should.equal(app.user.get('username'));
      should.exist(project.get('timestamp'));
    });

    it('A signed-out user can not create a project', function() {
      // Input
      var input = {
        text: 'Test Project'
      };

      app.user = new Backbone.Model({});
      
      // Setup fake collection
      projectsCollection = new ProjectsCollection();

      projectListView = new ProjectListView({ collection: projectsCollection });

      projectsCollection.trigger('sync');  // Sync event from collection causes view to render

      var projects = projectListView.$el.find('ul.projects');

      var nameField = projectListView.$el.find('#name');
      nameField.length.should.equal(1);   // Make sure the dom element exists
      nameField.val(input.name);

      var createProjectButton = projectListView.$el.find('button#createProject');
      createProjectButton.trigger('click');

      // Collection should not have any objects
      projectsCollection.length.should.equal(0);

      var error = projectListView.$el.find('#projectsError');
      should.exist(error);
      error.text().length.should.be.greaterThan(0);
      error.text().should.equal('Sorry, you must be logged in');
    });
  });
});