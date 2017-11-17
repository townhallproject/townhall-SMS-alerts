'use strict';
const firebaseDB = require('./lib/firebaseinit');
const server = require('./lib/server.js');

console.log(firebaseDB.ref('eventid').once('value')
.then(snapshot => {
  console.log(snapshot.val());
}
));

server.start();
