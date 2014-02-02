/* Global database init */
db = require('../db'); // db currently initialized as a global variable
cfg = require('../cfg/config.js');

cfg.RETHINKDB_DB = 'shots_test';  // Use fake database for running tests

before(function(next) {
  // Create new test database and tables
  db.setup(cfg, function(results) {
    next();
  });
});

after(function(next) {
  // Wipe database when done
  db.wipe(cfg, function(results) {
    next();
  });
});