'use strict';

let testArr = [1,2,3];
const accountId = process.env.TWILIO_ACCOUNT_ID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountId, authToken);
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const smsRouter = module.exports = express.Router();
// const townHallHandler = require('/townHall');
smsRouter.post('/sms', (req, res) => {
  const twiml = new client.TwimlResponse();
  twiml.message('I read you Lima Charlie');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});
client.messages
  .create({
    to: '+12064783243',
    from: '+14252305377',
    body: 'This is send-sms sending your text number',
  })
  .then((message) => console.log(message.sid));
  //write check zipcode function
  console.log(req.body);
// townHallHandler.getDistricts(req.body.Body)
// .then(res => townHallHandler.getEvents(res))
// .then(res => twiml.message(testArr))
// .catch('no events')
});
