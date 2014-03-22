/* Projects Controller - Ties together Layout, View, and Model/Controllers */

var ProjectListView = require('./list/projectListView.js');
var ProjectShowView = require('./show/projectShowView.js');

module.exports.List = Backbone.Marionette.Controller.extend({
    /* List - Displays a list of Projects
     Inputs:
    */
    initialize: function(options) {
        this.view = new ProjectListView();
   }
});

module.exports.Show = Backbone.Marionette.Controller.extend({
    /* Show - Displays a single Project
     Inputs:
        id: project's ID
    */
    initialize: function(options) {
        this.id = options.id;
        this.view = new ProjectShowView({id: this.id});
    }
});
