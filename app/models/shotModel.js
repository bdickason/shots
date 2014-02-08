/* Shot Model - data layer for a single Shot */
module.exports = Backbone.Model.extend({
    urlRoot: function() {
        return('/api/projects/' + this.instanceUrl);
    },
    initialize: function() {
        this.instanceUrl = this.get('projectId');
    },
    defaults: {
      text: ''
    }
  });
