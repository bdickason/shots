/* Routes - Contains all routes for client-side app */

var NavView = require('./views/navView.js');
var ProjectNavView = require('./views/projectNavView.js');
var ProjectsView = require('./views/projectsView.js');
var ProjectView = require('./views/projectView.js');
var ShotView = require('./views/shotView.js');
var SingleShotView = require('./views/singleShotView.js');

var ProjectsCollection = require('./collections/projectsCollection.js');

var ProjectModel = require('./models/projectModel.js');
var ShotModel = require('./models/shotModel.js');


module.exports = Backbone.Router.extend({
    routes: {
        '': 'home',
        ':project/:shot(/)': 'shot',    // the (/) catches both :shot and :shot/
        ':project(/)': 'project',
    },
    home: function(params) {
        // Default Route (/) - Display a list of the most recently updated projects
        console.log('Route: /');

        // Display navigation
        var navView = new NavView();
        $('nav').html(navView.$el); // Currently necessary because views persist after a new route is visited

        // Display list of latest projects
        projectsCollection = new ProjectsCollection();
        var projectsView = new ProjectsView({collection: projectsCollection});
        $('content').html(projectsView.$el);

    },
    project: function(project) {
        // (/:projectName) - Loads a single project
        console.log('[project]: /#' + project);
        
        // Display navigation
        var navView = new NavView();
        $('nav').html(navView.$el);

        // Display a single project
        projectModel = new ProjectModel({id: project});
        var projectView = new ProjectView({model: projectModel});
        $('content').html(projectView.$el);
    },
    shot: function(project, shot) {
        // (/:projectName/shotName) - Loads a single shot
        console.log('[shot]: /#' + project + '/' + shot);

        // Display navigation
        var navView = new NavView();
        $('nav').html(navView.$el);

        // Display 'project' sub-navigation
        projectModel = new ProjectModel({id: project});
        var projectNav = new ProjectNavView(projectModel);
        navView.$el.after(projectNav.$el);

        // Display a single shot
        shot = new ShotModel({id: shot, projectId: project});   // We need to use projectId because project is used elsewhere
        var singleShotView = new SingleShotView({model: shot});
        $('content').html(singleShotView.$el);
    }
});