'use strict';

const User = require('../models/user.js');
const firebasedb = require('../lib/firebaseinit');

module.exports = function(req, res, next){
  let users = [];
  firebasedb.ref(`sms-users`).once('value')
    .then((snapshot) => {
      snapshot.forEach((user) => {
        let newUser = new User(newUser.val());
        if (newUser.includeTownHall(req.districtObj)) {
          users.push(user);
        }

      });
      req.users = users;
      return next();
    });
};
