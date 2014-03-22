/* Comments Controller - Ties together Layout, View, and Model/Controllers */

// Views
var CommentsListView = require('./list/commentsListView.js');
var CommentsListCardView = require('./list/commentsListCardView.js');
// var ShotShowView = require('./show/shotShowView.js');
// var ShotShowCardView = require('./show/shotShowCardView.js');

// Models
var CommentModel = require('./models/commentModel.js');
var CommentsCollectionFirebase = require('./models/commentsCollectionFirebase.js');

module.exports.List = Backbone.Marionette.Controller.extend({
    /* List - Displays a list of Comments
     Inputs:
        project: project ID
        shot: shot ID
    */
    initialize: function(options) {
        this.projectId = options.projectId;
        this.shotId = options.shotId;

        this.comments = new CommentsCollectionFirebase([], {projectId: this.projectId, shotId: this.shotId});
        this.view = new CommentsListView({collection: this.comments});
   }
});

module.exports.ListCard = Backbone.Marionette.Controller.extend({
    /* ListCard - Displays the # of comments for a given Shot
     Inputs:
        projectId: ID of the project the shot belongs to
        id: shot's ID
    */
    initialize: function(options) {
        this.projectId = options.projectId;
        this.shotId = options.shotId;

        this.comments = new CommentsCollectionFirebase([], {projectId: this.projectId, shotId: this.shotId});
        this.view = new CommentsListCardView({collection: this.comments});
    }
});

// module.exports.Show = Backbone.Marionette.Controller.extend({
//     /* Show - Displays a single Shot
//      Inputs:
//         projectId: ID of the project the shot belongs to
//         id: shot's ID
//     */
//     initialize: function(options) {
//         this.projectId = options.projectId;
//         this.id = options.id;

//         this.shot = new ShotModelFirebase({projectId: this.projectId, id: this.id});
//         this.view = new ShotShowView({model: this.shot});
//     }
// });


