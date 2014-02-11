/* Project Model - data layer for a single Project */

module.exports = Backbone.Firebase.Model.extend({
  firebase: new Firebase(app.fbUrl + '/projects'),
  initialize: function() {
    // this.fbUrl = app.fbUrl + '/projects/' + this.get('id');
  }
});
