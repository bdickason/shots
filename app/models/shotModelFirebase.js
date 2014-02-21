/* Shot Model - Standalone model (do not use in collections) */

module.exports = Backbone.Firebase.Model.extend({
    firebase: function() {
        return(new Firebase(this.fbUrl));
    },
    initialize: function() {
        this.fbUrl = app.fbUrl + '/shots/' + this.get('projectId') + '/' + this.get('id');
    },
    defaults: {
      text: ''
    },
    getTime: function() {
        time = new Date(timestamp);
        hours = time.getHours();
        minutes = time.getMinutes();
        return(hours + ':' + minutes);
    }
});
