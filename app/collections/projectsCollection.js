/* Projects Collection - An ordered list of Projects */
var ProjectModel = require('../models/projectModel.js');

module.exports = Backbone.Collection.extend({
    model: ProjectModel,
    url: '/api/projects',
    initialize: function() {
      this.fetch();
    }
  });