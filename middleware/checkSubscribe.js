'use strict';
const moment = require('moment');
const messaging = require('../lib/response');
const scripts = require('../lib/scripts');

const User = require('../models/user');

const subscribeActions = require('../middleware/subscribeActions');
const deleteUser = require('../middleware/deleteUser');

const storage = require('../lib/storage')

module.exports = function(req, res, next){
  let response = req.body.Body;
  let from = req.body.From;

  if ((response.toLowerCase().substring(0, 2) === 'pa')) {
    deleteUser(req, res);
    return;
  }
  if (req.hasbeenasked) {
    if (response[0].toLowerCase() === 'y') {
      subscribeActions(req, res);
    } else {
      req.twiml.message(scripts.noSubscribe);
      messaging.end(res, req.twiml);
    }
    new User(req).deleteFromCache();
    return;
  }
  return next();
};
