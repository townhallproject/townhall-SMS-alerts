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
  firebasedb.ref('townHalls').on('child_removed', (snapshot) => {
    let townhall = new TownHall(snapshot.val());
    townhall.removeFromQueue()
      .catch((e) => {
        console.log(e);
      });
  });
  firebasedb.ref('sms-queue/').once('value').then(snapshot => {
    snapshot.forEach(ele => {
      let text = ele.val();
      firebasedb.ref('townHalls/' + text.eventId).once('value').then(snapshot => {
        if (!snapshot.exists()) {
          console.log(ele.key);
        }

      });
    });
  });
};
