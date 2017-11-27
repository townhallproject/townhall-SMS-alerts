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
      req.twiml.message('Thanks! We\'ll be in touch!');
      return messaging.end(res, req.twiml);
    });
};
