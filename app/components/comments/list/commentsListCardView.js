/* Comments View - displays a list of comments */

var commentsListCardTemplate = require('./commentsListCardTemplate.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
    tagName: 'div',
    template: commentsListCardTemplate,

    initialize: function() {
      this.id = this.collection.id;  // Shot ID
      this.projectId = this.collection.projectId;

      this.listenTo(this.collection, 'sync', this.render);    // Without this, the collection doesn't render after it completes loading
      this.listenTo(this.collection, 'remove', this.render);  // When a comment is deleted, server does not send a sync event
      this.listenTo(this.collection, 'add', this.render);     // When a comment is added, the collection doesn't sync
    },

    render: function() {
      this.$el.html(this.template(this.collection.toJSON()));

      return(this);
    }
  });
