/* Project Model - data layer for a single Project */

module.exports = Backbone.Firebase.Model.extend({
  firebase: new Backbone.Firebase(app.fbUrl + '/projejcts'),
  initialize: function() {
    // this.fbUrl = app.fbUrl + '/projects/' + this.get('id');
  }
});
