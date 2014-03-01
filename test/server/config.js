/* Tests for configuration variables (../cfg/config.js) */

var should = require('should');

var cfg = require('../cfg/config.js');

describe('SERVER', function() {

  describe('Config: config.js', function() {

    it('should exist', function() {
      // Config file should load properly

      // Input
      var input = null; // Function takes no arguments

      // Expected Result
      should.exist(cfg);
    });
  });

  describe('Config: NODE_ENV', function() {

    it('should be set', function() {
      // Environment variable to determine if we're on a dev or prod machine

      // Input
      var input = 'development';

      // Expected Result
      should.exist(cfg.NODE_ENV);
    });
  });

  
  describe('Config: Server Hostname', function() {

    it('should be set', function() {
      // Environment variable to determine the hostname node listens on

      // Input
      var input = 'localhost';

      // Expected Result
      should.exist(cfg.HOSTNAME);
    });
  });

  describe('Config: Server Port', function() {

    it('should be set', function() {
      // Environment variable to determine the port node listens on

      // Input
      var input = '3000';

      // Expected Result
      should.exist(cfg.PORT);
    });
  });

  describe('Config: Firebase', function() {

    it('should be set', function() {
      // Environment variable to determine the Firebase URL

      // Input
      var input = ''; // No defaut value

      // Expected Result
      should.exist(cfg.FIREBASE_URL);
    });
  });

  describe('Config: Mixpanel', function() {

    it('should be set', function() {
      // Environment variable to enable mixpanel tracking

      // Input
      var input = ''; // No defaut value

      // Expected Result
      should.exist(cfg.MIXPANEL_KEY);
    });
  });

});
