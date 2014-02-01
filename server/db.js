/* db.js - contains initialization of rethinkdb */

r = require('rethinkdb');

var dbConfig;
rdb = "";  // Shortcut to avoid typing r.db(blah)

module.exports.setup = function(cfg) {

  dbConfig = {
    host: cfg.RETHINKDB_HOST,
    port: cfg.RETHINKDB_PORT,
    db: cfg.RETHINKDB_DB,
    tables: {
      'projects': 'id',
      'shots': 'id',
      'users': 'id'
    }
  };



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
        rdb = r.db(dbConfig.db);
        // Database exists, Check if tables exist
        for(var table in dbConfig.tables) {
          (function(tableName) {
            rdb.tableCreate(tableName, { primaryKey: dbConfig.tables[table]}).run(conn, function(err, result) {
              if(err) {
                //console.log(err);
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

module.exports.get = function(table, callback) {
  // Get all entries from a specific table in the db
  onConnect(function(err, connection) {
    rdb.table(table).run(connection, function(err, cursor) {
      if(err) {
        callback(err, null);
      }
      else {
        cursor.toArray(function(error, results) {
          // RethinkDb returns a cursor by default: http://www.rethinkdb.com/docs/troubleshooting/#i-get-back-a-connection-in-my-callback-with-t
          callback(err, results);
        });
      }
      connection.close();
    });
  });
};

function onConnect(callback) {
  r.connect({host: dbConfig.host, port: dbConfig.port }, function(err, connection) {
    if(err) {
      throw(err);
    }
    else {
      connection['_id'] = Math.floor(Math.random()*10001);
      callback(err, connection);
    }
  });
}

module.exports.wipe = function(cfg, callback) {

  dbConfig = {
    host: cfg.RETHINKDB_HOST,
    port: cfg.RETHINKDB_PORT,
    db: cfg.RETHINKDB_DB,
    tables: {
      'projects': 'id',
      'shots': 'id',
      'users': 'id'
    }
  };

  // Initial setup and connection for database
  r.connect({ host: dbConfig.host, port: dbConfig.port, db: dbConfig.db }, function(err, conn) {
    if(err) {
      throw err;
    }
    else {
      // Check if tables already exist. If not, create them
      r.dbDrop(dbConfig.db).run(conn, function(err, result) {
        if(err) {
          callback(err);
        }
        else {
          console.log("Db (" + result.name + ") wiped.\n");
          callback(result);
        }
      });
      //return(conn);
    }
  });
};