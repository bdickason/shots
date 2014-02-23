/* Routes - Contains all routes for client-side app */

// Top Navigation
var NavView = require('./nav/navView.js');

// Projects
var ProjectsCollectionFirebase = require('./projects/projectsCollectionFirebase.js');

var ProjectModel = require('./projects/projectModel.js');
var ProjectModelFirebase = require('./projects/projectModelFirebase.js');

var ProjectsView = require('./projects/projectsView.js');
var ProjectView = require('./projects/projectView.js');

// Projects -> Nav
var ProjectNavView = require('./projects/projectNav/projectNavView.js');   // Used in Shot view

// Shots
var ShotModelFirebase = require('./shots/ShotModelFirebase.js');

var ShotView = require('./shots/shotView.js');


module.exports = Backbone.Router.extend({
    routes: {
        '': 'home',
        ':project/:shot(/)': 'shot',    // the (/) catches both :shot and :shot/
        ':project(/)': 'project',
    },
    home: function(params) {
        // Default Route (/) - Display a list of the most recently updated projects
        console.log('Route: /');

        app.views.forEach(app.utils.close);

        // Display navigation
        var navView = new NavView({model: app.user});
        this.showView('nav', navView); // Currently necessary because views persist after a new route is visited

        // Display list of latest projects
        var projectsCollectionFirebase = new ProjectsCollectionFirebase();
        var projectsView = new ProjectsView({collection: projectsCollectionFirebase});
        this.showView('content', projectsView);
    },
    project: function(project) {
        // (/:projectName) - Loads a single project
        console.log('[project]: /#' + project);

        app.views.forEach(app.utils.close);
        
        // Display navigation
        var navView = new NavView({model: app.user});
        this.showView('nav', navView);

        // Display a single project
        var projectModelFirebase = new ProjectModelFirebase({id: project});
        var projectView = new ProjectView({model: projectModelFirebase});

        this.showView('content', projectView);
    },
    shot: function(project, shot) {
        // (/:projectName/shotName) - Loads a single shot
        console.log('[shot]: /#' + project + '/' + shot);

        app.views.forEach(app.utils.close);

        // Display navigation
        var navView = new NavView({model: app.user});
        this.showView('nav', navView);

        // Display 'project' sub-navigation
        var projectModelFirebase = new ProjectModelFirebase({id: project});
        var projectNav = new ProjectNavView(projectModelFirebase);
        this.appendView(navView, projectNav);

        // Display a single shot
        var shotModel = new ShotModelFirebase({id: shot, projectId: project});   // We need to use projectId because project is used elsewhere
        var shotView = new ShotView({model: shotModel });
        this.showView('content', shotView);
    },
    showView: function(selector, view) {
        // Utility function to show a specific view that overrides a DOM object
        $(selector).html(view.render().el);
        
        app.views.push(view);   // Keep track of views so we can close them
        return(view);
    },
    appendView: function(masterView, childView) {
        // Utility function to show a specific view that is displayed after an existing view
        masterView.$el.after(childView.render().el);
        
        app.views.push(childView);  // Keep track of views so we can close them
        return(childView);
    }
});