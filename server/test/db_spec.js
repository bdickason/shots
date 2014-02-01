/* Global database init */
db = require('../db'); // db currently initialized as a global variable
cfg = require('../cfg/config.js');

before(function() {
    db.setup(cfg);
    console.log('Initialized db');
});
