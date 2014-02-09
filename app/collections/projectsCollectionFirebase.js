/* Projects Collection - An ordered list of Projects */
var ProjectModelFirebase = require('../models/projectModelFirebase.js');

module.exports = Backbone.Firebase.Collection.extend({
    model: ProjectModelFirebase,
    firebase: function() {
      return(new Firebase(this.fbUrl));
    },
    initialize: function() {
      this.fbUrl = app.fbUrl + '/projects/';
    }
  });