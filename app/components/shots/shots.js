/* Shots Controller - Ties together Layout, View, and Model/Controllers */

// Views
var ShotsListView = require('./list/shotsListView.js');
var ShotShowView = require('./show/shotShowView.js');

// Models
var ShotModelFirebase = require('./models/shotModelFirebase.js');
var ShotsCollectionFirebase = require('./models/shotsCollectionFirebase.js');

module.exports.List = Backbone.Marionette.Controller.extend({
    /* List - Displays a list of Shots
     Inputs:
        project: project ID
    */
    initialize: function(options) {
        this.project = options.project;
        this.shots = new ShotsCollectionFirebase([], {project: this.project});
        this.view = new ShotsListView({collection: this.shots, project: this.project});
   }
});

module.exports.Show = Backbone.Marionette.Controller.extend({
    /* Show - Displays a single Shot
     Inputs:
        projectId: ID of the project the shot belongs to
        id: shot's ID
    */
    initialize: function(options) {
        this.projectId = options.projectId;
        this.id = options.id;

        this.shot = new ShotModelFirebase({projectId: this.projectId, id: this.id});
        this.view = new ShotShowView({model: this.shot});
    }
});


// module.exports.ShowCard = Backbone.Marionette.Controller.extend({
//     /* ShowCard - Displays a single Project's Card (summary view)
//      Inputs:
//         id: project's ID
//     */
//     initialize: function(options) {
//         this.id = options.id;

//         this.project = new ProjectModelFirebase({id: this.id});
//         this.view = new ProjectShowCardView({model: this.project});
//     }
// });
