/* Tests for Projects (../projects/projects.js) */

var should = require('should');

var cfg = require('../cfg/config.js');
var projects = require('../projects/projects.js');

describe('Projects', function() {
  describe('GET with no arguments', function() {
    it('should return an empty list of projects', function(done) {
      // Input
      var input = null; // Function takes no arguments

      // Expected Result
      var expectedResult = [];

      projects.get(function(callback) {
        should.exist(callback);
        callback.should.be.type('object');
        callback.should.eql(expectedResult);
        done();
      });
    });
  });

  describe('PUT a project with no shots', function() {
    it('should successfully insert an empty project', function(next) {
      // Input
      var name = 'model-edit';
      var input = { "name": name };

      // Expected Result
      var expectedResult = { "Inserted": 1 };

      projects.put(input, function(callback) {
        should.exist(callback);
        callback.should.be.type('object');
        callback.errors.should.equal(0);
        callback.inserted.should.equal(1);
        next();
      });
    });
  });

  describe('GET with a valid ID', function() {
    it('should return a single project', function(done) {
      // Input
      var name = 'model-edit';

      // Expected Result
      var expectedResult = {
        "name": 'model-edit'
      };

      projects.getById(name, function(callback) {
        should.exist(callback);
        callback.should.be.type('object');
        callback.should.eql(expectedResult);
        done();
      });
    });
  });

});
