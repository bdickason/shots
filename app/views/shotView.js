/* Shot View - displays a shot module embedded inside another page */

var shotTemplate = require('./templates/shotTemplate.hbs');

var CommentsCollectionFirebase = require('../collections/commentsCollectionFirebase');
var CommentsView = require('../views/commentsView.js');

module.exports = Backbone.View.extend({

  template: shotTemplate,

  initialize: function(data, options) {
    this.listenTo(this.model, 'change', this.render); // Without this, the model doesn't render after it completes loading
    this.listenTo(this.model, 'remove', this.render); // Without this, the model sticks around after being deleted elsewhere
    this.commentsCollectionFirebase = new CommentsCollectionFirebase([], {id: this.model.get('id'), projectId: this.model.get('projectId')});
    this.commentsView = new CommentsView({ collection: this.commentsCollectionFirebase});
  },

  events: {
    'click .shotlink': 'gotoShot'
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    // Render comments
    $('.comments', this.$el).html(this.commentsView.render().el);
    
    this.delegateEvents();  // Fix for events not firing in sub-views: http://stackoverflow.com/questions/9271507/how-to-render-and-append-sub-views-in-backbone-js
    
    return this;
  },

  gotoShot: function(e) {
    // Navigate to a shot
    e.preventDefault(); // Have to disable the default behavior of the anchor

    var shotId = this.model.get('projectId') + '/' + this.model.get('id');
    route = shotId;

    app.router.navigate(route, {trigger: true});

  }
});
