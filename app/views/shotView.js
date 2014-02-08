/* Shot View - displays a single shot */

var shotTemplate = require('./templates/shotTemplate.hbs');

var ShotModel = require('../models/shotModel.js');

module.exports = Backbone.View.extend({

  template: shotTemplate,

  initialize: function() {
    this.listenTo(this.model, 'sync', this.render); // Without this, the collection doesn't render after it completes loading
    this.model.fetch();
  },

  events: {
    'click .shotlink': 'gotoShot'
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    console.log(this.model.toJSON());
    return this;
  },

  gotoShot: function(e) {
    // Navigate to a shot
    e.preventDefault(); // Have to disable the default behavior of the anchor

    var shotId = this.model.get('project') + '/' + this.model.get('id');
    route = shotId;

    app.router.navigate(route, {trigger: true});

  },
  debug: function(e) {
    console.log(e);
  }
});
