/* db.js - contains initialization of rethinkdb */

r = require('rethinkdb');

module.exports.setup = function(cfg) {

  var dbConfig = {
    host: cfg.RETHINKDB_HOST,
    port: cfg.RETHINKDB_PORT,
    db: cfg.RETHINKDB_DB,
    tables: {
      'projects': 'id',
      'shots': 'id',
      'users': 'id'
    }
  };

  var db;

  // Initial setup and connection for database
  r.connect({ host: dbConfig.host, port: dbConfig.port, db: dbConfig.db }, function(err, conn) {
    if(err) {
      throw err;
    }
    else {
      // Check if tables already exist. If not, create them
      r.dbCreate(dbConfig.db).run(conn, function(err, result) {
        if(err) {
          // console.log(err);
        }
        else {
          console.log("Db (" + result.name + ") created.\n");
        }
        db = r.db(dbConfig.db);
        // Database exists, Check if tables exist
        for(var table in dbConfig.tables) {
          (function(tableName) {
            db.tableCreate(tableName, { primaryKey: dbConfig.tables[table]}).run(conn, function(err, result) {
              if(err) {
                // console.log(err);
              }
              else {
                console.log("Table (" + tableName + ") is created.\n");
              }
            });
          })(table);
        }
      });
      return(conn);
    }
  });
};