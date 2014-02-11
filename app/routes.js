/* Routes - Contains all routes for client-side app */

var NavView = require('./views/navView.js');
var ProjectNavView = require('./views/projectNavView.js');
var ProjectsView = require('./views/projectsView.js');
var ProjectView = require('./views/projectView.js');
var ShotView = require('./views/shotView.js');
var SingleShotView = require('./views/singleShotView.js');

var ProjectsCollectionFirebase = require('./collections/projectsCollectionFirebase.js');

var ProjectModelFirebase = require('./models/projectModelFirebase.js');
var ShotModelFirebase = require('./models/ShotModelFirebase.js');


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
        projectsCollectionFirebase = new ProjectsCollectionFirebase();
        var projectsView = new ProjectsView({collection: projectsCollectionFirebase});
        $('content').html(projectsView.$el);

    },
    project: function(project) {
        // (/:projectName) - Loads a single project
        console.log('[project]: /#' + project);
        
        // Display navigation
        var navView = new NavView();
        $('nav').html(navView.$el);

        // Display a single project
        projectModelFirebase = new ProjectModelFirebase({id: project});
        var projectView = new ProjectView({model: projectModelFirebase});
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
        shot = new ShotModelFirebase({id: shot, projectId: project});   // We need to use projectId because project is used elsewhere
        var singleShotView = new SingleShotView({model: shot});
        $('content').html(singleShotView.$el);
    }
});