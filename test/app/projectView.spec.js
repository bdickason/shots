/* Tester for Project View */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should'),
    fs = require('fs'),
    path = require('path'),
    sinon = require('sinon');
    
describe('projectView', function() {

  var ProjectModel, ProjectView;

  beforeEach(function(done) {
    clientenv.setup(function() {
      
      // Pre-compile Handlebars template
      var Handlebars = require('handlebars');
      var templateFilename = path.resolve(__dirname, componentsDir + 'projects/projectTemplate.hbs');
      var projectTemplate = Handlebars.compile(templateFilename);

      // Setup objects
      ProjectView = require(componentsDir + 'projects/projectView.js');
      ProjectModel = Backbone.Model;  // Dummy model to pass into view

      done();
    });
  });

  describe('initialize', function() {
    it('loads without errors', function() {
      should.exist(ProjectView);
      projectModel = new ProjectModel({});
      var projectView = new ProjectView({model: projectModel});
      should.exist(projectView);
    });
  });

  describe('edit projects', function() {
    it('Non-owner should not see edit/delete', function() {
      // Fake JSON output for model stub
      var fakeOutput = {};
      var projectModel = new ProjectModel({});
      var projectStub = sinon.stub(projectModel, 'toJSON').returns(fakeOutput);

      projectModel.toJSON().should.equal(fakeOutput);

      var projectView = new ProjectView({model: projectModel});
      projectModel.trigger('sync'); // Render the view

      var project = projectView.$el;
      project.html().should.not.containEql('editProject');
      project.html().should.not.containEql('cancelProjectEdit');
      project.html().should.not.containEql('saveProject');
      project.html().should.not.containEql('deleteProject');

      projectStub.restore();
    });

    it('Owner should see edit/delete for their own projects', function() {
      // Fake JSON output for model stub
      var fakeOutput = {
        owner: true
      };
      var projectModel = new ProjectModel({});
      var projectStub = sinon.stub(projectModel, 'toJSON').returns(fakeOutput);

      projectModel.toJSON().should.equal(fakeOutput);

      var projectView = new ProjectView({model: projectModel});
      projectModel.trigger('sync'); // Render the view

      var project = projectView.$el.find('p.projectSettings');
      
      project.html().should.containEql('editProject');
      project.html().should.containEql('cancelProjectEdit');
      project.html().should.containEql('cancelProjectEdit');
      project.html().should.containEql('saveProject');
      project.html().should.containEql('deleteProject');

      projectStub.restore();
    });
  });


});