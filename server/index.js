express = require('express');
http = require('http');
cfg = require('./cfg/config.js');

module.exports.startServer = function() {
  app = express();

  // Configure middleware
  app.use(express.favicon());



  app.listen(cfg.PORT); // Start the server
};