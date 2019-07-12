'use strict';
const messaging = require('../lib/response');
const scripts = require('../lib/scripts');

const User = require('../models/user');

const subscribeActions = require('../middleware/subscribeActions');
const deleteUser = require('../middleware/deleteUser');
const userIsAttending = require('../middleware/userIsAttending');
const unSubscribeFromRep = require('../middleware/unSubscribeFromRep');
const constants = require('../constants');

const {
  ALERT_SENT,
} = constants;

module.exports = function(req, res, next){
  let response = req.body.Body;

  // replying with pause
  if ((response.toLowerCase().substring(0, 4) === 'paus')) {
    deleteUser(req, res);
    return;
  }
  // sent a town hall alert, asked if they were attending. 
  if (req.sessionType === ALERT_SENT) {
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

  // asked if they want to subscribe 
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

  // start of vol recruit conversation 
  if (req.sessionType === 'volRecruit') {
    let user = new User(req);
    let message = {
      body: response,
      from_user: true,
    };
    user.updateCache({
      messages: [...req.messages, message],
    });
    return;
  }
  return next();
};
