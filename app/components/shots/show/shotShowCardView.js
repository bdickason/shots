/* Shot View - displays a shot module embedded inside another page */

var shotShowCardTemplate = require('./shotShowCardTemplate.hbs');

var CommentsCollectionFirebase = require('../../comments/models/commentsCollectionFirebase.js');
var CommentsCardView = require('../../comments/list/commentsListCardView.js');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: shotShowCardTemplate,

  initialize: function(options) {
    // Model is passed in via controller   
    this.listenTo(this.model, 'change', this.render); // Without this, the model doesn't render after it completes loading
    this.listenTo(this.model, 'remove', this.render); // Without this, the model sticks around after being deleted elsewhere

    this.listenTo(app.user, 'change', this.render); // If a user logs in, we need to re-render
    
    // Setup comment card to show # of comments
    this.commentsCollectionFirebase = new CommentsCollectionFirebase([], {shotId: this.model.get('id'), projectId: this.model.get('projectId')});
    this.commentsCardView = new CommentsCardView({ collection: this.commentsCollectionFirebase});

    this.$el.attr('id', this.model.get('id'));
    this.$el.addClass('shot');
  },

  events: {
    'click .shotlink': 'gotoShot',
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    // Render comments
    this.$el.find('.shotComments').html(this.commentsCardView.render().el);
    
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
