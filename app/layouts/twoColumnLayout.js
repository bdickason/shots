/* Two Column Layout - Sets up left and right side-by-side views */

var twoColumnLayoutTemplate = require('./twoColumnLayoutTemplate.hbs');

module.exports = Backbone.Marionette.Layout.extend({
  template: twoColumnLayoutTemplate,

  regions: {
    left: {
      selector: "section#left"
    },
    right: {
      selector: "section#right"
    }
  }
});