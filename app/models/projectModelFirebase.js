/* Project Model - For standalone use (not in a collection) */

module.exports = Backbone.Firebase.Model.extend({
  firebase: function() {
    return(new Firebase(this.fbUrl));
  },
  initialize: function() {
    this.fbUrl = app.fbUrl + '/projects/' + this.get('id');
  }
});
