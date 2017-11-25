'use strict';

const User = require('../models/user.js');
const firebasedb = require('../lib/firebaseinit');
const messaging = require('../lib/response');


module.exports = function(req){

  firebasedb.ref(`sms-users`).once('value')
    .then((snapshot) => {
      snapshot.forEach((user) => {
        let newUser = new User (req, user);
        newUser.writeToFirebase(newUser);
        messaging.sendAndWrite(req, res, 'You have been added for updates in your area.');
        // return next();

      });
    });
};
