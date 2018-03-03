'use strict';

const User = require('../models/user.js');
const messaging = require('../lib/response');

module.exports = function(req, res){

  let newUser = new User (req);
  newUser.writeToFirebase(req).then(() => {
    req.twiml.message(`You have been added for updates in ${req.session.zipcode}. To stop these updates, text unsub.`);
    return messaging.end(res, req.twiml);
  });
};
