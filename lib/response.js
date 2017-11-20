'use strict';

const MessagingResponse = require('twilio').twiml.MessagingResponse;
const messaging = module.exports = {};

messaging.sendAndWrite = function(res, message){
  let twiml = messaging.send(message);
  messaging.end(res, twiml);
};

messaging.send = function(message){
  let twiml = new MessagingResponse();
  twiml.message(message);
  return (twiml);
};

messaging.end = function(res, twiml) {
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
};
