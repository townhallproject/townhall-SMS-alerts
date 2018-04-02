'use strict';
const messaging = require('../lib/response');
const scripts = require('../lib/scripts');

const subscribeActions = require('../middleware/subscribeActions');
const deleteUser = require('../middleware/deleteUser');

module.exports = function(req, res, next){
  let response = req.body.Body;
  if ((response.toLowerCase().substring(0, 2) === 'pa')) {
    deleteUser(req, res);
    return;
  }
  if (req.session.doyouwanttosignup) {
    req.session.doyouwanttosignup = null;
    if (response[0].toLowerCase() === 'y') {
      subscribeActions(req, res);
    } else {
      req.twiml.message(scripts.noSubscribe);
      return messaging.end(res, req.twiml)
    }
    return
  }
  return next();
};
