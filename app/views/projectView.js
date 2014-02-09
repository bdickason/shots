/* Project View - displays a single projects */

var projectTemplate = require('./templates/projectTemplate.hbs');

var ShotsCollection = require('../collections/shotsCollection.js');
var ShotsCollectionFirebase = require('../collections/shotsCollectionFirebase.js');

var ShotsView = require('../views/shotsView.js');

module.exports = Backbone.View.extend({
  tagName: 'div',

  template: projectTemplate,

  initialize: function() {
    this.listenTo(this.model, 'sync', this.render); // Without this, the collection doesn't render after it completes loading
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    
    if(this.model.get('shots')) {
      shots = this.model.get('shots');

      shots[0] = shots[1];  // Temporary hack for my improperly added data.
      shotsCollectionFirebase = new ShotsCollectionFirebase(shots, this.model.get('id'));
      // shotsCollection = new ShotsCollection(this.model.get('shots'));
      console.log(shotsCollectionFirebase.toJSON());
      shotsView = new ShotsView({ collection: shotsCollectionFirebase, project: this.model.get('id') });
    }

    return this;
  }
});
