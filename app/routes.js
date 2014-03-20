/* Routes - Contains all routes for client-side app */

// Top Navigation
var NavView = require('./components/nav/navView.js');

// Projects
var ProjectListView = require('./components/projects/list/projectListView.js');
var ProjectView = require('./components/projects/show/projectView.js');
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

        // Sub-nav Hack for Marionette Layouts
        var navView = new NavView({model: app.user});
        app.header.show(navView);

        // Hack for Marionette Layouts
        app.subhead.close();

        // Display list of latest projects
        var projectListView = new ProjectListView();
        app.content.show(projectListView);
    },

    project: function(project) {
        // (/:projectName) - Loads a single project
        console.log('[project]: /#' + project);

        // Display navigation
        var navView = new NavView({model: app.user});
        app.header.show(navView);

        // Sub-nav Hack for Marionette Layouts
        app.subhead.close();

        // Display a single project
        var projectView = new ProjectView({id: project});

        app.content.show(projectView);
    },

    shot: function(project, shot) {
        // (/:projectName/shotName) - Loads a single shot
        console.log('[shot]: /#' + project + '/' + shot);

        // Display navigation
        var navView = new NavView({model: app.user});
        app.header.show(navView);

        // Display 'project' sub-navigation
        var projectNav = new ProjectNavView({id: project});
        app.subhead.show(projectNav);

        // Display a single shot
        var shotView = new ShotView({id: shot, projectId: project });
        app.content.show(shotView);
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