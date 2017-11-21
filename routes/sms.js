'use strict';
const express = require('express');
const bodyParser = require('body-parser').urlencoded({
  extended: false,
});
const smsRouter = module.exports = express.Router();

const MessagingResponse = require('twilio').twiml.MessagingResponse;
const messaging = require('../lib/response');
const session = require('express-session');
const townHallHandler = require('./townHallMiddleware');
const getEvents = require('./getEventsMiddleware');

smsRouter.post('/sms',
  bodyParser,
  townHallHandler.checkZip,
  townHallHandler.getDistricts,
  getEvents,
  (req, res) => {
    if (req.townHalls.length > 0) {

      req.townHalls.forEach((townhall) => {
        req.twiml.message(townhall.print());
      });
      req.twiml.message('That\'s all the events we have for your reps');
      return messaging.end(res, req.twiml);
    }
    messaging.sendAndWrite(req, res, 'There are not any upcoming town halls in your area.');
  });
