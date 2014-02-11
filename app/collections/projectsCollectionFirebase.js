/* Projects Collection - An ordered list of Projects */
var ProjectModelFirebase = require('../models/projectModelFirebase.js');

module.exports = Backbone.Firebase.Collection.extend({
    model: ProjectModelFirebase,
    firebase: new Backbone.Firebase(app.fbUrl + '/projects/'),
    initialize: function() {
    }
  });