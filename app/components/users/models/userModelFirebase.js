/* Shot Model - Standalone model (do not use in collections) */

module.exports = Backbone.Firebase.Model.extend({
    firebase: function() {
        return(new Firebase(this.fbUrl));
    },
    initialize: function() {
        this.fbUrl = app.fbUrl + '/users/' + this.id;
        console.log(this.fbUrl);
    },
    defaults: {
        profileImage: 'http://blah.com/blah.jpg'
    }
});
