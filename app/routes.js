/* Routes - Contains all routes for client-side app */

/* Layouts */
var TwoColumnLayout = require('./layouts/twoColumnLayout.js');

/* Controllers */
// Top Navigation
var NavView = require('./components/nav/navView.js');

// Projects
var Projects = require('./components/projects/projects.js');
var ProjectNavView = require('./components/projects/projectNav/projectNavView.js');   // Used in Shot view

// Shots
var Shots = require('./components/shots/shots.js');

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

        // Sub-nav Hack for Marionette Layouts
        var navView = new NavView({model: app.user});
        app.header.show(navView);

        // Hack for Marionette Layouts
        app.subhead.close();

        // Display list of latest projects
        var projects = new Projects.List();
        app.content.show(projects.view);
    },

    project: function(projectId) {
        // (/:projectName) - Loads a single project
        console.log('[project]: /#' + projectId);

        // Display navigation
        var navView = new NavView({model: app.user});
        app.header.show(navView);

        // Sub-nav Hack for Marionette Layouts
        app.subhead.close();

        // Details for a single project
        var projects = new Projects.List({id: projectId});

        // var project = new Projects.Show({id: projectId});

        var shots = new Shots.List({project: projectId});

        // Use a two column layout to display the project
        var twoColumn = new TwoColumnLayout();

        app.content.show(twoColumn);

        // Render two-column layout in main content area
        twoColumn.left.show(projects.view);
        twoColumn.right.show(shots.view);
    },

    shot: function(projectId, shotId) {
        // (/:projectName/shotName) - Loads a single shot
        console.log('[shot]: /#' + projectId + '/' + shotId);

        // Display navigation
        var navView = new NavView({model: app.user});
        app.header.show(navView);

        // Display 'project' sub-navigation
        var projectNav = new ProjectNavView({id: projectId});
        app.subhead.show(projectNav);

        // Display a single shot
        var shot = new Shots.Show({projectId: projectId, id: shotId});
        app.content.show(shot.view);
    },

    contribute: function() {
        // (/contribute) - Contribute to this project
        console.log('Route: contribute');

        // Display navigation
        var navView = new NavView({model: app.user});
        app.header.show(navView);

        // Sub-nav Hack for Marionette Layouts
        app.subhead.close();

        // Display contribute page
        var contributeView = new ContributeView();
        app.content.show(contributeView);
    },

    help: function() {
        // (/help) - Getting Started, Documentation, etc.
        console.log('Route: help');

        // Display navigation
        var navView = new NavView({model: app.user});
        app.header.show(navView);

        // Sub-nav Hack for Marionette Layouts
        app.subhead.close();

        // Display help content
        var helpView = new HelpView();
        app.content.show(helpView);
    }
});