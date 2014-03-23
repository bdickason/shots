/* Shot Model - Standalone model (do not use in collections) */

module.exports = Backbone.Firebase.Model.extend({
    firebase: function() {
        return(new Firebase(this.fbUrl));
    },
    initialize: function() {
        this.fbUrl = app.fbUrl + '/users/' + this.id;
    },
    defaults: {
        profileImage: 'http://blah.com/blah.jpg',
        username: function() {
            // Hack - for users that weren't saved before we implemented it
            return(this.id);
        }
    }
});
