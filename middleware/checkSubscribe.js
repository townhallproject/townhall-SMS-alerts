'use strict';
const messaging = require('../lib/response');
const scripts = require('../lib/scripts');

const User = require('../models/user');

const subscribeActions = require('../middleware/subscribeActions');
const deleteUser = require('../middleware/deleteUser');
const userIsAttending = require('../middleware/userIsAttending');
const unSubscribeFromRep = require('../middleware/unSubscribeFromRep');

module.exports = function(req, res, next){
  let response = req.body.Body;

  if ((response.toLowerCase().substring(0, 2) === 'pa')) {
    deleteUser(req, res);
    return;
  }
  if (req.alertSent) {
    if (response[0].toLowerCase() === 'y') {
      userIsAttending(req, res);
    }
    if (response[0].toLowerCase() === 'n') {
      req.twiml.message(scripts.notAttending);
      messaging.end(res, req.twiml);
    }  
    if (response.substring(0,3).toLowerCase() === 'not') {
      unSubscribeFromRep(req, res);
    }
    return new User(req).deleteFromCache();
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
