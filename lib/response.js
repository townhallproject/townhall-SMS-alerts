'use strict';
require('dotenv').load();
const accountSid = process.env.NODE_ENV === 'production' ? process.env.TWILIO_ACCOUNT_ID : process.env.TWILIO_ACCOUNT_SID_TESTING;
const authToken = process.env.NODE_ENV === 'production' ? process.env.TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN_TESTING;
const Twilio = require('twilio');

const messaging = module.exports = {};
const fromNumber = process.env.NODE_ENV === 'production' ? process.env.TWILIO_NUMBER : '+15005550006';

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
  const client = new Twilio(accountSid, authToken);
  console.log(body,to);
  if (!body) {
    return Promise.resolve({sent: {
      alertSent : false,
    }});
  }
  return client.messages.create({
    body: body,
    to: to,
    from: fromNumber,
  });
};
