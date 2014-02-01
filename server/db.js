/* db.js - contains initialization of rethinkdb */

r = require('rethinkdb');
// cfg = require('./cfg/config.js');

module.exports.setup = function(cfg) {
  // Initial setup and connection for database
  r.connect({ host: cfg.RETHINKDB_HOST, port: cfg.RETHINKDB_PORT, db: cfg.RETHINKDB_DB }, function(err, conn) {
    if(err) throw err;
    else
      return(conn);
  });
};