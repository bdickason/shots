/* Project Model - data layer for a single Project */
module.exports = Backbone.Model.extend({
  initialize: function() {
    console.log("init!");
  },
    defaults: {
      text: ''
    }
  });
