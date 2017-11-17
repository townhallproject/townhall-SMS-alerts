'use strict';
const firebaseDB = require('./lib/firebaseinit');

console.log(firebaseDB.ref('eventid').once('value')
.then(snapshot => {
  console.log(snapshot.val());
}
));
