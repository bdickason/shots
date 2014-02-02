/* db.js - contains initialization of rethinkdb */

r = require('rethinkdb');

var dbConfig;
rdb = "";  // Shortcut to avoid typing r.db(blah)

module.exports.setup = function(cfg, callback) {

  dbConfig = {
    host: cfg.RETHINKDB_HOST,
    port: cfg.RETHINKDB_PORT,
    db: cfg.RETHINKDB_DB,
    tables: {
      'projects': 'name',
      'shots': 'id'
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
        rdb = r.db(dbConfig.db);
        tables = [];
        // Database exists, Check if tables exist
        for(var table in dbConfig.tables) {
          tableObject = rdb.tableCreate(table, {primaryKey: dbConfig.tables[table]});
          tables.push(tableObject);
        }
        r.expr(tables).run(conn, function(err, results) {
          /* In order to have a single callback point for unit tests, 
             we have to create all tables in a single command */
          if(err) {
            callback(err);
          }
          else {
            callback(results);
          }
        });
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

module.exports.getById = function(id, table, callback) {
  // Get a single entry from the db
  onConnect(function(err, connection) {
    rdb.table(table).get(id).run(connection, function(err, result) {
      if(err) {
        callback(err, null);
      }
      else {
        callback(err, result);
      }
      connection.close();
    });
  });
};

module.exports.put = function(id, table, callback) {
  // Get a single entry from the db
  onConnect(function(err, connection) {
    rdb.table(table).insert(id).run(connection, function(err, result) {
      if(err) {
        callback(err, null);
      }
      else {
        callback(err, result);
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
          callback(result);
        }
      });
      //return(conn);
    }
  });
};