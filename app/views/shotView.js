/* Shot View - displays a shot module embedded inside another page */

var shotTemplate = require('./templates/shotTemplate.hbs');

var ShotModel = require('../models/shotModel.js');

module.exports = Backbone.View.extend({

  template: shotTemplate,

  initialize: function() {
    this.listenTo(this.model, 'sync', this.render); // Without this, the collection doesn't render after it completes loading
    this.render();  // Data is passed in, so we don't need to call a URL
  },

  events: {
    'click .shotlink': 'gotoShot',
    'click .save': 'saveShot'
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  saveShot: function() {
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
