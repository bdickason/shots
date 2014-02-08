/* Configuration File - contains all hardcoded values */

exports.HOSTNAME = process.env.HOSTNAME || 'localhost';
exports.PORT = process.env.PORT || '3000';

exports.RETHINKDB_HOST = process.env.RETHINKDB_HOST || 'localhost';
exports.RETHINKDB_PORT = process.env.RETHINKDB_PORT || '28015';
exports.RETHINKDB_DB = process.env.RETHINKDB_DB || 'shots';
exports.RETHINKDB_AUTHKEY = process.env.RETHINKDB_AUTHKEY || null;