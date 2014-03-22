/* Comments Controller - Ties together Layout, View, and Model/Controllers */

// Views
var CommentsListView = require('./list/commentsListView.js');
// var ShotShowView = require('./show/shotShowView.js');
// var ShotShowCardView = require('./show/shotShowCardView.js');

// Models
var CommentModelFirebase = require('./models/commentModelFirebase.js');
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
        this.view = new CommentssListView({collection: this.comments});
   }
});

// module.exports.ListCard = Backbone.Marionette.Controller.extend({
//     /* ShowCard - Displays a single Shot's Card (summary view)
//      Inputs:
//         projectId: ID of the project the shot belongs to
//         id: shot's ID
//     */
//     initialize: function(options) {
//         this.projectId = options.projectId;
//         this.id = options.id;

//         this.shot = new ShotModelFirebase({id: this.id});
//         this.view = new ShotShowCardView({model: this.projectId});
//     }
// });

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


