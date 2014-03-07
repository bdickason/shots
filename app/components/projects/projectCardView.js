/* Project Card View - displays a snapshot of a single projects */

var ProjectModelFirebase = require('./projectModelFirebase.js');

var projectCardTemplate = require('./projectCardTemplate.hbs');

module.exports = Backbone.View.extend({
  tagName: 'div',

  template: projectCardTemplate,

  initialize: function() {
    if(!this.model) {
      this.model = new ProjectModelFirebase({id: this.id});
    }
  
    this.listenTo(this.model, 'sync', this.render); // Without this, the collection doesn't render after it completes loading
  },

  render: function() {

    this.$el.html(this.template(this.model.toJSON()));

    this.delegateEvents();  // Fix for events not firing in sub-views: http://stackoverflow.com/questions/9271507/how-to-render-and-append-sub-views-in-backbone-js    
    return this;
  }
});
