/* Shot Model - Standalone model (do not use in collections) */

module.exports = Backbone.Model.extend({
    firebase: function() {
        return(new Firebase(this.fbUrl));
    },
    initialize: function() {
        this.fbUrl = app.fbUrl + '/users/' + this.get('id');
    }
});
