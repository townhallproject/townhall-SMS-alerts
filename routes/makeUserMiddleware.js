'use strict';

const User = require('../models/user.js');
const firebasedb = require('../lib/firebaseinit');

module.exports = function(req){

  firebasedb.ref(`sms-users`).once('value')
    .then((snapshot) => {
      snapshot.forEach((user) => {
        let newUser = new User (req, user);
        newUser.writeToFirebase(newUser);
        // return next();

      });
    });
};
