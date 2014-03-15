/* Tester for App */

var clientenv = require('../helpers/helper.spec.js'),
    should = require('should');

describe('App', function() {
  var view;

  beforeEach(function(done) {
    clientenv.setup(function() {
      Backbone = window.Backbone;
      _ = window._;
      done();
    });
  });

  describe('loads', function() {
    it('loads the app javascript', function() {
      var app = require('../../app/app.js');
      should.exist(app);
    });

    it('loads the app javascript', function() {
      require('../../app/app.js');
      true.should.equal(true);
    });
  });

});

