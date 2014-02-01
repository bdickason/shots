/* Global database init */
db = require('../db'); // db currently initialized as a global variable
cfg = require('../cfg/config.js');

cfg.RETHINKDB_DB = 'shots_test';  // Use fake database for running tests

before(function() {
  db.setup(cfg);
  console.log("blah");
});

after(function() {
  // Wipe database when done
});