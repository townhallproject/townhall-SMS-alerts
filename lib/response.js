'use strict';
require('dotenv').load();
const accountSid = process.env.TWILIO_ACCOUNT_ID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const messaging = module.exports = {};

messaging.sendAndWrite = function(req, res, message){
  let twiml = messaging.send(req, message);
  messaging.end(res, twiml);
};

messaging.send = function(req, message){
  req.twiml.message(message);
  return (req.twiml);
};

messaging.end = function(res, twiml) {
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
};

messaging.newMessage = function(body, to) {
  const client = require('twilio')(accountSid, authToken);
  return client.messages.create({
    body: body,
    to: to,
    from: process.env.TWILIO_NUMBER,
  });
};
