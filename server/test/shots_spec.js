/* Tests for shots (../shots/shots.js) */

var should = require('should');

var cfg = require('../cfg/config.js');
var shots = require('../shots/shots.js');

describe('Shots', function() {

  var shotId;

  describe('GET with no arguments', function() {
    it('should not exist', function() {
      // This functionality is covered by GET /projects
      // Input
      var input = null; // Function takes no arguments

      // Expected Result
      should.not.exist(shots.get);
    });
  });

  describe('PUT a shot into a project', function() {
    it('should successfully insert a shot', function(next) {
      // Input
      var project = 'model-edit';
      var author = 'bdickason';
      var text = 'blah blah blah blah blah';
      var image = 'http://google.com/blah1.jpg';

      var input = {
        "project": project,
        "author": author,
        "text": text,
        "image": image
      };

      // Expected Result
      var expectedResult = { "Inserted": 1 };

      shots.put(input, function(callback) {
        should.exist(callback);
        callback.should.be.type('object');
        callback.errors.should.equal(0);
        callback.inserted.should.equal(1);
        callback.generated_keys.length.should.be.greaterThan(0); // We generate a uuid for each shot when we create it
        shotId = callback.generated_keys[0]; // Save the uuid for use in future tests
        next();
      });
    });
  });

  describe('GET with a valid Project and ID', function() {
    it('should return a single shot', function(done) {
      // Input
      var project = 'model-edit';
      var shot = shotId;  // Created in the previous test

      // Expected Result
      var expectedResult = {
        "id": shotId,
        "project": 'model-edit',
        "author": 'bdickason',
        "text": 'blah blah blah blah blah',
        "image": 'http://google.com/blah1.jpg'
      };

      shots.getById(shot, project, function(callback) {
        should.exist(callback);
        callback.should.be.type('object');
        callback.should.eql(expectedResult);
        done();
      });
    });
  });

  describe('GET all shots from a given Project with one shot', function() {
  it('should return a list with one shot', function(done) {
    // Input
    var project = 'model-edit';

    // Expected Result
    var expectedResult = [{
      "id": shotId,
      "project": 'model-edit',
      "author": 'bdickason',
      "text": 'blah blah blah blah blah',
      "image": 'http://google.com/blah1.jpg'
    }];

    shots.getByProject(project, function(callback) {
      should.exist(callback);
      callback.should.be.type('object');
      callback.should.eql(expectedResult);
      done();
    });
  });
  });

});
