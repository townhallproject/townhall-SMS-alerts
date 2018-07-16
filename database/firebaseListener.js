const firebasedb = require('../lib/firebaseinit');
const TownHall = require('../models/event');
const Text = require('../models/texts');

module.exports = function() {
  firebasedb.ref('townHalls').on('child_added', (snapshot) => {
    let townhall = new TownHall(snapshot.val());
    if (townhall.includeInQueue()) {
      townhall.lookupUsers().then((users) => {
        if (users.length > 0) {
          users.forEach(user => {
            //make a new text to send, add to queue
            let newText = new Text(user, townhall);
            newText.writeToFirebase();
          });
        }
      }).catch((e) => {
        console.log(e);
      });
    }
  });
};
