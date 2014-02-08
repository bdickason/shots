/* Project View - displays a single projects */

var projectTemplate = require('./templates/projectTemplate.hbs');

var ShotsCollection = require('../collections/shotsCollection.js');

var ShotsView = require('../views/shotsView.js');

module.exports = Backbone.View.extend({
  tagName: 'div',

  template: projectTemplate,

  initialize: function() {
    this.model.fetch();
    this.listenTo(this.model, 'sync', this.render); // Without this, the collection doesn't render after it completes loading
    //this.render();
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    
    if(this.model.get('shots')) {
      shotsModel = new ShotsCollection(this.model.get('shots'));
      shotsView = new ShotsView({ collection: shotsModel, project: this.model.get('id') });
    }

    return this;
  }
});
