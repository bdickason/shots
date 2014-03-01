/* app.utils - Tests for utility functions */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should');

describe('App', function() {
  var view;

  beforeEach(function(done) {
    clientenv.setup(function() {
      $ = window.$;
      _ = window._;
      Backbone = window.Backbone;

      

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
      });

      it('Closes a view without a model', function() {
      });
    });

    describe('debug', function() {
      it('Outputs events', function() {
        
      })

    });

  });

});