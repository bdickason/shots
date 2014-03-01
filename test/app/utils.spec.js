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
      it('Closes a view without a model', function() {
        var View = Backbone.View.extend({});
        var view = new View();
        var Model = Backbone.Model.extend({});
        var model = new Model();

        view.listenTo(model, 'sync', function() {
        });

        ({}).should.not.eql(view._listeningTo); // For some reason we can't .should on a backbone-derived object

        utils.close(view);
        
        ({}).should.eql(view._listeningTo);
      });

      it('Closes a view without a model', function() {
      });
    });

    describe('debug', function() {
      it('Outputs events', function() {
        
      });

    });

  });

});