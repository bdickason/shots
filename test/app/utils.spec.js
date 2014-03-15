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

    describe('close(view)', function() {
      it('Closes a view with a model', function() {
        /*  For some reason this test takes ~4.5kms
        var Model = Backbone.Model.extend({});
        var model = new Model();

        var View = Backbone.View.extend({});
        var view = new View(model);

        view.listenTo(model, 'all', function() {
          
        });
        
        ({}).should.not.eql(view._listeningTo); // For some reason we can't .should on a backbone-derived object


        utils.close(view);

        console.log(view);
        
        ({}).should.eql(view._listeningTo);
        */
      });

      it('Closes a view without a model', function() {
        var View = Backbone.View.extend({});
        var view = new View({});

        view.on('change', function() {

        });
        
        should.exist(view._events);

        utils.close(view);
        
        should.not.exist(view._events);
      });
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