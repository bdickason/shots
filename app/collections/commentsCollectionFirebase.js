/* Comments Collection - An ordered list of Comments */
var CommentModel = require('../models/commentModel.js');

module.exports = Backbone.Firebase.Collection.extend({
    model: CommentModel,
    comparator: function(model) {
      // Sorts model by timestamp, newest first
      return(-model.get('timestamp'));
    },
    firebase: function() {
        return(new Firebase(this.fbUrl));
    },
    initialize: function(models, options) {
        this.fbUrl = app.fbUrl + '/comments/' + options.projectId + '/' + options.id;
    }
  });