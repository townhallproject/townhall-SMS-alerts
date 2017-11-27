'use strict';

const User = require('../models/user.js');
const messaging = require('../lib/response');


module.exports = function(req, res){
  console.log('reached make user middleware');

  let newUser = new User (req);
  newUser.writeToFirebase().then(() => {
    req.twiml.message(`You have been added for updates in ${req.session.zipcode}`);
    return messaging.end(res, req.twiml);
  });
};
