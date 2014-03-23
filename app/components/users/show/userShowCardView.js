/* User Card View - displays a user's image and name */

var userShowCardTemplate = require('./userShowCardTemplate.hbs');

module.exports = Backbone.Marionette.ItemView.extend({
    tagName: 'div',
    template: userShowCardTemplate,
    initialize: function() {
        this.listenTo(this.model, 'sync', this.render);
    }
});
