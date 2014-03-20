/* app.utils - Tests for utility functions */

var clientenv = require('../helpers/helper.spec.js');
var should = require('should');

describe('App', function() {
  var view;

  beforeEach(function(done) {
    clientenv.setup(function() {
      // Load necessary .js
      utils = require('../../app/utils.js');

      done();
    });
  });

  describe('utils', function() {
    it('Loads properly', function() {
      should.exist(utils);
    });

    it('Registers hbsfy', function() {
      should.exist(app.Handlebars);
    });

    describe('debug', function() {
      it('Outputs events', function() {
      });

    });

    describe('formatTime', function() {
      it("Returns a model's json with human-readable time", function() {
        // Input
        var input = {
          name: 'Test Name',
          timestamp: new Date()
        };

        var testModel = new Backbone.Model(input);

        input.should.eql(testModel.toJSON());

        var formattedJSON = utils.formatTime(testModel);

        input.time = "a few seconds ago";

        input.should.eql(formattedJSON);

      });
    });

  });

});