'use strict';

const MessagingResponse = require('twilio').twiml.MessagingResponse;

module.exports = function(res, message){
  const twiml = new MessagingResponse();
  twiml.message(message);
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
};
