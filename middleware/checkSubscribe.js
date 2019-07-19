'use strict';
const messaging = require('../lib/response');
const scripts = require('../lib/scripts');
const User = require('../models/user');

const subscribeActions = require('../middleware/subscribeActions');
const deleteUser = require('../middleware/deleteUser');
const userIsAttending = require('../middleware/userIsAttending');
const unSubscribeFromRep = require('../middleware/unSubscribeFromRep');
const constants = require('../constants');
const production = process.env.NODE_ENV === 'production';
const {
  ALERT_SENT,
  VOL_RECRUIT,
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
    } else if (response[0].toLowerCase() === 'n') {
      req.twiml.message(scripts.notAttending);
      messaging.end(res, req.twiml);
    } else if (response.substring(0,3).toLowerCase() === 'not') {
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
  // vol recruit conversation 
  if (req.sessionType === VOL_RECRUIT) {
    let user = new User(req);
    // save message from user
    user.updateCacheWithMessageInConvo(response, true);
    // if simple response, send automatic response
    if (req.messageCount === 1 && response.toLowerCase() === 'yes') {
      // still save that we responded in the message flow
      user.updateCacheWithMessageInConvo(scripts.willVolunteer, false, VOL_RECRUIT);
      messaging.sendAndWrite(req, res, scripts.willVolunteer);
      return;
    }
    if (production) {
      // forward message to nathan's phone
      messaging.newMessage(response, process.env.NATHAN);
    }
    messaging.end(res, req.twiml);
    return;
  }
  return next();
};
