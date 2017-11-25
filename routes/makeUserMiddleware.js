'use strict';

const User = require('../models/user.js');
const firebasedb = require('../lib/firebaseinit');
const messaging = require('../lib/response');


module.exports = function(req, res){
  console.log('reached make user middleware');

  firebasedb.ref(`sms-users`).once('value')
    .then( () => {
      console.log('reached snapshot');
      let newUser = new User (req);
      newUser.writeToFirebase(newUser);
      req.twiml.message('You have been added for updates in your chosen area code');
      return messaging.end(res, req.twiml);
    });
};
