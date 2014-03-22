/* Tester for Project Model */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should');
    
describe('projectModel', function() {

  var ProjectModel;

  beforeEach(function(done) {
    clientenv.setup(function() {
      ProjectModel = require(componentsDir + 'projects/models/projectModel.js');

      done();
    });
  });

  describe('initialize', function() {
    it('loads without errors', function() {
      should.exist(ProjectModel);
      var projectModel = new ProjectModel();
      should.exist(projectModel);
    });
  });

  describe('isOwner', function() {
    it('Returns true if user matches owner', function() {
      var input = {
        id: 'My Project',
        user: 'bob'
      };

      var projectModel = new ProjectModel(input);

      projectModel.isOwner(input.user).should.be.true;
    });

    it('Returns false is user does not match owner', function() {
      var input = {
        id: 'My Project',
        user: 'bob'
      };

      var projectModel = new ProjectModel(input);

      projectModel.isOwner('bilbo baggins').should.not.be.true;
    });
  });

  describe('toJSON', function() {
    it('Sets the owner flag to true if the current user is the owner', function() {
      // Input
      var input = {
        id: 'My Project',
        user: 'bob'
      };

      // 'Log in' the current user
      app.user = new Backbone.Model({});
      app.user.set('username', input.user);

      var projectModel = new ProjectModel(input);

      var output = projectModel.toJSON();

      should.exist(output.owner);
      output.owner.should.be.true;
    });

    it('Does not set the owner flag if the current user is not the owner', function() {
      // Input
      var input = {
        text: 'My fancy project',
        user: 'bob'
      };

      // 'Log in' another user
      app.user = new Backbone.Model({});
      app.user.set('username', 'bilbo baggins');

      var projectModel = new ProjectModel(input);

      var output = projectModel.toJSON();

      should.not.exist(output.owner);
    });

    it('Does not set the owner flag if the current user is signed out', function() {
      // Input
      var input = {
        text: 'My fancy project',
        user: 'bob'
      };

      app.user = new Backbone.Model({});

      var projectModel = new ProjectModel(input);

      var output = projectModel.toJSON();

      should.not.exist(output.owner);
    });

    it('renders a proper timestamp', function() {
      // input
      var input = {
        text: 'This is a project',
        user: 'username',
        timestamp: new Date()
      };

      app.user = new Backbone.Model({});

      var projectModel = new ProjectModel(input);

      var output = projectModel.toJSON();


      should.exist(output.timestamp);
      should.exist(output.time);
      output.time.should.equal('a few seconds ago');
    });
  });

});

