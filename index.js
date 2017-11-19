'use strict';
const server = require('./lib/server.js');

server.start()
  .then(console.log)
  .catch(console.log);
