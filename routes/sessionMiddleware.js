'use strict';

const MessagingResponse = require('twilio').twiml.MessagingResponse;

module.exports = function(req, res, next){
  req.twiml = new MessagingResponse();
  let sessionData = req.session;
  sessionData.counter = sessionData.counter || 0;
  sessionData.counter++;
  next();
};
