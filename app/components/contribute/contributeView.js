/* Contribute View - For anyone who wants to contribute! */

var contributeTemplate = require('./contributeTemplate.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'div',

  template: contributeTemplate,
});
