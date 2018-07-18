const firebasedb = require('../lib/firebaseinit');
const TownHall = require('../models/event');

module.exports = function() {
  firebasedb.ref('townHalls').on('child_added', (snapshot) => {
    let townhall = new TownHall(snapshot.val());
    if (townhall.includeInQueue()) {
      townhall.lookupUsersAndAddToQueue()
        .catch((e) => {
          console.log(e);
        });
    }
  });
};
