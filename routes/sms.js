'use strict';

let testArr = [1,2,3];
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const smsRouter = module.exports = express.Router();

smsRouter.post('/sms', (req, res) => {
  console.log('kjdfld');
  const twiml = new MessagingResponse();
  twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});
