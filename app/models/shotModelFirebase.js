/* Shot Model - data layer for a single Shot */

module.exports = Backbone.Firebase.Model.extend({
    firebase: new Backbone.Firebase(app.fbUrl + '/shots/'),
    initialize: function() {
    },
    defaults: {
      text: ''
    }
});
