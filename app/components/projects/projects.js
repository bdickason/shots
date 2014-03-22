/* Projects Controller - Ties together Layout, View, and Model/Controllers */

// Views
var ProjectListView = require('./list/projectListView.js');
var ProjectShowView = require('./show/projectShowView.js');

// Models
var ProjectModelFirebase = require('./models/projectModelFirebase.js');
var ProjectsCollectionFirebase = require('./models/projectsCollectionFirebase.js');

module.exports.List = Backbone.Marionette.Controller.extend({
    /* List - Displays a list of Projects
     Inputs:
    */
    initialize: function(options) {
        this.projects = new ProjectsCollectionFirebase();
        this.view = new ProjectListView({collection: this.projects});
   }
});

module.exports.Show = Backbone.Marionette.Controller.extend({
    /* Show - Displays a single Project
     Inputs:
        id: project's ID
    */
    initialize: function(options) {
        this.id = options.id;

        this.project = new ProjectModelFirebase({id: this.id});
        this.view = new ProjectShowView({model: this.project});
    }
});
