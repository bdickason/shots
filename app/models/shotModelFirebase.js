/* Shot Model - Standalone model (do not use in collections) */

module.exports = Backbone.Firebase.Model.extend({
    firebase: new Firebase(app.fbUrl + '/shots/'),
    initialize: function() {
    },
    defaults: {
      text: ''
    }
});
