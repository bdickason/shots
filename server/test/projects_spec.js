/* Tests for Projects (../projects/projects.js) */

var should = require('should');

var cfg = require('../cfg/config.js');
var projects = require('../projects/projects.js');

describe('Projects', function() {
  describe('GET with no arguments', function() {
    it('should return a list of projects', function(done) {
      // Input
      var input = null; // Function takes no arguments

      // Expected Result
      var expectedResult = [
      { "name": "model-edit",
        "shots": [
          { "id": 0 },
          { "id": 1 }
        ]
      },
      { "name": "facebook-login",
        "shots": [
          { "id": 5 },
          { "id": 90 }
        ]
      }
    ];

      projects.get(function(callback) {
        should.exist(callback);
        callback.should.be.type('object');
        callback.should.eql(expectedResult);
        done();
      });
    });
  });

  describe('GET with a valid ID', function() {
    it('should return a single project', function(done) {
      // Input
      var project = 'model-edit';

      // Expected Result
      var expectedResult = {
        "name": 'model-edit',
        "shots": [
            { "id": 0 },
            { "id": 1 },
            { "id": 2 },
        ]
      };

      projects.getById(project, function(callback) {
        should.exist(callback);
        callback.should.be.type('object');
        callback.should.eql(expectedResult);
        done();
      });
    });
  });

});
