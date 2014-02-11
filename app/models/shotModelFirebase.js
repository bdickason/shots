/* Shot Model - data layer for a single Shot */

module.exports = Backbone.Firebase.Model.extend({
    firebase: new Firebase(app.fbUrl + '/shots/'),
    initialize: function() {
    },
    defaults: {
      text: ''
    }
});
