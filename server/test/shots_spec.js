/* Tests for shots (../shots/shots.js) */

var should = require('should');

var cfg = require('../cfg/config.js');
var shots = require('../shots/shots.js');

describe('Shots', function() {
  describe('GET with no arguments', function() {
    it('should not exist', function() {
      // Input
      var input = null; // Function takes no arguments

      // Expected Result
      should.not.exist(shots.get);
    });
  });

  describe('GET with a valid Project and ID', function() {
    it('should return a single shot', function(done) {
      // Input
      var project = 'model-edit';
      var shot = 0;

      // Expected Result
      var expectedResult = {
        "id": 0,
        "project": 'model-edit',
        "author": {
          "id": 6,
          "avatar": "http://www.google.com/blah.jpg",
          "name": "bdickason"
        },
        "text": "blah blah blah blah blah.",
        "images": [
          { "url": "http://google.com/blah1.jpg" },
          { "url": "http://google.com/blah2.jpg" }
        ]
      };

      shots.getById(shot, project, function(callback) {
        should.exist(callback);
        callback.should.be.type('object');
        callback.should.eql(expectedResult);
        done();
      });
    });
  });

});
