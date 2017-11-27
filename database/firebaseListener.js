const firebasedb = require('../lib/firebaseinit');
const TownHall = require('../models/event');

module.exports = function() {
  firebasedb.ref('townHalls').on('child_added', (snapshot) => {
    let townhall = new TownHall(snapshot.val());
    if (townhall.includeInQueue()) {
      townhall.lookupUsers().then((users) => {
        if (users.exists()) {
          users.forEach(user => {
            console.log(user.val());
            //make a new text to send, add to queue
            //new Text(user, towhall)
            //Text.writeToFirebase()
          });
        }

      }).catch(() => {
        // console.log(e);
      });

    } 

  });
};
