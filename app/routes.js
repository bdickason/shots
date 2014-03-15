/* Routes - Contains all routes for client-side app */

// Top Navigation
var NavView = require('./components/nav/navView.js');

// Projects
var ProjectsView = require('./components/projects/projectsView.js');
var ProjectView = require('./components/projects/projectView.js');
var ProjectNavView = require('./components/projects/projectNav/projectNavView.js');   // Used in Shot view

// Shots
var ShotView = require('./components/shots/show/shotView.js');

// Contribute
var ContributeView = require('./components/contribute/contributeView.js');

// Help
var HelpView = require('./components/help/helpView.js');

module.exports = Backbone.Router.extend({
    routes: {
        '': 'home',
        'contribute(/)': 'contribute',
        'help(/)': 'help',
        ':project/:shot(/)': 'shot',    // the (/) catches both :shot and :shot/
        ':project(/)': 'project'
    },

    home: function(params) {
        // Default Route (/) - Display a list of the most recently updated projects
        console.log('Route: /');

        app.views.forEach(app.utils.close);

        // Display navigation
        var navView = new NavView({model: app.user});
        this.showView('nav', navView); // Currently necessary because views persist after a new route is visited

        // Display list of latest projects
        var projectsView = new ProjectsView();
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
        var projectView = new ProjectView({id: project});

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
        var projectNav = new ProjectNavView({id: project});
        this.appendView(navView, projectNav);

        // Display a single shot
        var shotView = new ShotView({id: shot, projectId: project });
        this.showView('content', shotView);
    },

    contribute: function() {
        // (/contribute) - Contribute to this project
        console.log('Route: contribute');
        app.views.forEach(app.utils.close);

        // Display navigation
        var navView = new NavView({model: app.user});
        this.showView('nav', navView);

        // Display contribute page
        var contributeView = new ContributeView();
        this.showView('content', contributeView);
    },

    help: function() {
        // (/help) - Getting Started, Documentation, etc.
        console.log('Route: help');
        app.views.forEach(app.utils.close);

        // Display navigation
        var navView = new NavView({model: app.user});
        this.showView('nav', navView);

        // Display help content
        var helpView = new HelpView();
        this.showView('content', helpView);
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