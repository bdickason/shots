/* Shots View - displays a list of shots */

var ShotView = require('./shotView.js');
var shotsTemplate = require('./shotsTemplate.hbs');

module.exports = Backbone.View.extend({
    tagName: 'div',
    template: shotsTemplate,

    initialize: function(options) {
      this.project = options.project;  // Save project name in case we need to add
      
      this.listenTo(this.collection, 'sync', this.render); // Without this, the collection doesn't render after it completes loading
      this.listenTo(this.collection, 'remove', this.render);  // When a shot is deleted, server does not send a sync event
      this.listenTo(this.collection, 'add', this.render);
      
      this.setElement(this.$el);
    },
    
    events: {
      'keyup .input': 'pressEnter',
      'click #createShot': 'createShot',
      'click #deleteShot': 'deleteShot',
      'click img': 'toggleSize'
    },

    pressEnter: function(e) {
      // Submit form when user presses enter
      if(e.which == 13 && $('#text').val()) {
        this.createShot();
      }
      return(false);
    },

    createShot: function(shot) {
      if($('#text').val() || $('#image').val()) {
        var input = {
          text: $('#text').val(),
          image: this.parseImageUrl($('#image').val()),
          user: app.user.get('username'),
          timestamp: Firebase.ServerValue.TIMESTAMP, // Tells the server to set a createdAt timestamp
          projectId: this.project
        };

        this.collection.create(input);
        mixpanel.track('Create Shot', input);

        $('#text').val('');
        $('#image').val('');
      }
    },

    deleteShot: function(e) {
      e.preventDefault(); // Have to disable the default behavior of the anchor
      var shotId = $(e.currentTarget).data('id');
      var shot = this.collection.get(shotId);
      var owner = shot.get('user');

      if(app.user.get('username') == owner) {
        this.collection.remove(shot);
      }
    },

    parseImageUrl: function(url) {
      // Some image hosts default to give the user a webpage displaying the image, but we need to extract the direct link
      switch(url.substring(0, 19)) {
        case 'http://cl.ly/image/':
          // Cloudapp link
          // Example Link: http://cl.ly/image/3w3x2u363M1o
          // Example Image: http://cl.ly/image/3w3x2u363M1o/download
          url += '/download';
          break;
        case 'https://www.dropbox':
          // Dropbox Link
          // Example Link: https://www.dropbox.com/s/axdpwwv3lematw9/Screenshot%202014-02-22%2017.14.46.png
          // Example Image: https://dl.dropboxusercontent.com/s/axdpwwv3lematw9/Screenshot%202014-02-22%2017.14.46.png?dl=1&token_hash=AAFao11at8PTdSH5T7qKaX0wiDo1deZFfB-5YQgLYiv6gA
          // Hopefully we don't need the token_hash :x
          url = 'https://dl.dropboxusercontent.com' + url.slice(23);  // Remove domain and https
          break;
        default:
          // For all other images, just pass the link through
      }

        return(url);
    },

    toggleSize: function(e) {
      // Enlarge or shrink a shot image
      $(e.currentTarget).toggleClass('big');
    },
    
    render: function() {
      this.$el.html(this.template(this.collection.toJSON()));

      // Iterate through each shot model and add it to our list of shots
      var self = this;
      this.collection.each(function(shot) {
        var shotView = new ShotView({model: shot, projectId: self.project});
        this.$el.find('ul.shots').append(shotView.render().el);
      }, this);

      this.delegateEvents();  // Fix for events not firing in sub-views: http://stackoverflow.com/questions/9271507/how-to-render-and-append-sub-views-in-backbone-js
      return(this);
    }
  });
