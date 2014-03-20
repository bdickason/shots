/* Help View - For anyone that needs help, gets lost, etc. */

var helpTemplate = require('./helpTemplate.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'div',

  template: helpTemplate,
});
