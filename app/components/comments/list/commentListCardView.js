/* Comments View - displays a list of comments */

var commentListCardTemplate = require('./commentListCardTemplate.hbs');

module.exports = Backbone.View.extend({
    tagName: 'div',
    template: commentListCardTemplate,

    initialize: function() {
      this.id = this.collection.id;  // Shot ID
      this.projectId = this.collection.projectId;

      this.listenTo(this.collection, 'sync', this.render);    // Without this, the collection doesn't render after it completes loading
      this.listenTo(this.collection, 'remove', this.render);  // When a comment is deleted, server does not send a sync event
      this.listenTo(this.collection, 'add', this.render);     // When a comment is added, the collection doesn't sync
  
      this.setElement(this.$el);

    },

    render: function() {
      this.$el.html(this.template(this.collection.toJSON()));

      this.delegateEvents();  // Fix for events not firing in sub-views: http://stackoverflow.com/questions/9271507/how-to-render-and-append-sub-views-in-backbone-js
      return(this);
    }
  });
