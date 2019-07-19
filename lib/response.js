'use strict';
require('dotenv').load();

const accountIdMapping = {
  'production': process.env.TWILIO_ACCOUNT_ID,
  'staging': process.env.TWILIO_ACCOUNT_ID,
  'dev': process.env.TWILIO_ACCOUNT_SID_TESTING,
  'test': process.env.TWILIO_ACCOUNT_SID_TESTING,
};

const authTokenMapping = {
  'production': process.env.TWILIO_AUTH_TOKEN,
  'staging': process.env.TWILIO_AUTH_TOKEN,
  'dev': process.env.TWILIO_AUTH_TOKEN_TESTING,
  'test': process.env.TWILIO_AUTH_TOKEN_TESTING,
};

const fromNumberMap = {
  'production': process.env.TWILIO_NUMBER,
  'staging': process.env.TWILIO_STAGING_NUMBER,
  'dev': process.env.TWILIO_TESTING_NUMBER,
  'test': process.env.TWILIO_TESTING_NUMBER,
};

const accountSid = accountIdMapping[process.env.NODE_ENV];
const authToken = authTokenMapping[process.env.NODE_ENV];

const Twilio = require('twilio');
const constants = require('../constants');

const {
  ALERT_SENT,
} = constants;

const messaging = module.exports = {};

const fromNumber = fromNumberMap[process.env.NODE_ENV];

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
  if (!body) {
    return Promise.resolve({sent: {
      sessionType: ALERT_SENT,
    }});
  }
  return client.messages.create({
    body: body,
    to: to,
    from: fromNumber,
  });
};
