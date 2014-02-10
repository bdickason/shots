/* Project Model - data layer for a single Project */

module.exports = Backbone.Firebase.Model.extend({
  firebase: function() {
    return(new Firebase(this.fbUrl));
  },
  initialize: function() {
    this.fbUrl = app.fbUrl + '/projects/' + this.get('id');
  },
  defaults: function() {
    return {
      shots: []
    };
  }
});
