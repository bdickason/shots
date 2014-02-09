/* Shot Model - data layer for a single Shot */
module.exports = Backbone.Model.extend({
    initialize: function() {
        console.log('initialized');
    },
    defaults: {
      text: ''
    }
  });
