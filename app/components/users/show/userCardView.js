/* User Card View - displays a user's image and name */

var userCardTemplate = require('./userCardTemplate.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
    tagName: 'div',
    template: userCardTemplate
  });
