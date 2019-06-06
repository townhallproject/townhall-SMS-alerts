'use strict';
const User = require('../models/user.js');
const messaging = require('../lib/response');
const scripts = require('../lib/scripts');

module.exports = function (req, res) {
  let newUser = new User(req);
  newUser.updateAttending(req).then(() => {
    req.twiml.message(scripts.isAttending);
    return messaging.end(res, req.twiml);
  }).catch(err => {
    console.log(err);
    next(new Error('Thanks for letting us know'));
  });
};
