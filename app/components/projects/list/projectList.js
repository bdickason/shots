/* Projects Controller - Ties together Layout, View, and Model/Controllers */

var ProjectListView = require('./projectListView.js');

module.exports = Backbone.Marionette.Controller.extend({
    initialize: function(options) {
        this.region = options.region;

        this.view = new ProjectListView();
        this.region.show(this.view);
    }
});