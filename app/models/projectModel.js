/* Project Model - data layer for a single Project */

module.exports = Backbone.Model.extend({
  urlRoot: '/api/projects',
  initialize: function() {
  },
    defaults: {
      shots: []
    }
  });
