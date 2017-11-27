'use strict';

const MessagingResponse = require('twilio').twiml.MessagingResponse;

module.exports = function(req, res, next){
  req.twiml = new MessagingResponse();
  next();
};
