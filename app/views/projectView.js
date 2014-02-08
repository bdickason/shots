/* Project View - displays a single projects */

var projectTemplate = require('./templates/projectTemplate.hbs');

var ShotsView = require('../views/shotsView.js');

module.exports = Backbone.View.extend({
  tagName: 'div',

  template: projectTemplate,

  initialize: function() {
    this.listenTo(this.model, 'sync', this.render); // Without this, the collection doesn't render after it completes loading
    this.model.fetch();
    //this.render();
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    if(this.model.get('shots')) {
      shots = this.model.get('shots');
      shotsView = new ShotsView(shots);
    }

    return this;
  }
});
