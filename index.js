'use strict';
const server = require('./lib/server.js');
const townHallHandler = require('./routes/townHall');

townHallHandler.getDistricts('40312')
  .then(townHallHandler.getEvents)
  .then()
  .catch(console.log)
;

server.start();
