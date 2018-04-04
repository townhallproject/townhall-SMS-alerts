'use strict';
const User = require('../models/user.js');
const messaging = require('../lib/response');

module.exports = function(req, res){
  let newUser = new User (req);
  newUser.writeToFirebase(req).then(() => {
    req.twiml.message(`You have been added for updates in ${req.zipcode}. Respond with PAUSE anytime to stop receiving these notices.  To start again, send your zipcode.`);
    return messaging.end(res, req.twiml);
  }).catch(err=> {
    console.log(err);
    next(new Error('Oh no! Something went wrong when we tried to save your data, please send your zip again'));
  });
};
