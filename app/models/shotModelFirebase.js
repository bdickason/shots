/* Shot Model - data layer for a single Shot */

module.exports = Backbone.Firebase.Model.extend({
    firebase: function() {
        return(new Firebase(this.fbUrl));
    },
    initialize: function() {
        this.fbUrl = app.fbUrl + '/shots/' + this.get('id');
    },
    defaults: {
      text: ''
    }
});
