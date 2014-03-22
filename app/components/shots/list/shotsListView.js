/* Shots View - displays a list of shots */

var shotsListTemplate = require('./shotsListTemplate.hbs');

var ShotShowCardView = require('../show/shotShowCardView.js');

module.exports = Backbone.Marionette.CompositeView.extend({
    tagName: 'div',
    template: shotsListTemplate,

    itemView: ShotShowCardView,
    itemViewContainer: 'ul.shots',

    initialize: function(options) {
      this.project = options.project;  // Save project name in case we need to add
      
      // Collection is passed in from Controller
      this.listenTo(this.collection, 'sync', this.render); // Without this, the collection doesn't render after it completes loading
      this.listenTo(this.collection, 'remove', this.render);  // When a shot is deleted, server does not send a sync event
    },
    
    events: {
      'keyup .input': 'pressEnter',
      'click #newShot': 'toggleNewShot',
      'click #createShot': 'createShot',
      'click img': 'toggleSize',
      'error': 'showError'
    },

    pressEnter: function(e) {
      // Submit form when user presses enter
      if(e.which == 13 && $('#text').val()) {
        this.createShot();
      }
      return(false);
    },

    toggleNewShot: function() {
      // Displays/hides the 'New Shot' interface

      if(app.user.get('loggedIn')) {
        var newShotView = this.$el.find('.newShotView');
        newShotView.toggle();
      }
    },

    createShot: function(shot) {
      if(app.user.get('loggedIn')) {
        var textField = this.$el.find('#text');
        var imageField = this.$el.find('#image');
        if(textField.val() || imageField.val()) {
          var input = {
            text: textField.val(),
            image: this.parseImageUrl(imageField.val()),
            user: app.user.get('username'),
            timestamp: Firebase.ServerValue.TIMESTAMP, // Tells the server to set a createdAt timestamp
            projectId: this.project
          };

          this.collection.create(input);
          this.collection.trigger('sync');  // HACK - Marionette View normally places new models at the end of the collection
          mixpanel.track('Create Shot', input);

          textField.val('');
          imageField.val('');

          this.toggleNewShot(); // Hide 'new' dialog
        }
      }
      else {
        this.showError('Sorry, you must be logged in');
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

    showError: function(message) {
      var error = this.$el.find('#shotsError');
      error.text(message);
      error.show();
    },

    onRender: function() {
      this.delegateEvents();
    }
  });
