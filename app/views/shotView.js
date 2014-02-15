/* Shot View - displays a shot module embedded inside another page */

var shotTemplate = require('./templates/shotTemplate.hbs');

module.exports = Backbone.View.extend({

  template: shotTemplate,

  initialize: function(data, options) {
    this.model.set('projectId', options.projectId); // Allows us to use the project Id in our template
    this.listenTo(this.model, 'change', this.render); // Without this, the collection doesn't render after it completes loading
  },

  events: {
    'click .shotlink': 'gotoShot'
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
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
