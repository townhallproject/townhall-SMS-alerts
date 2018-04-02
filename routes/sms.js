'use strict';
const express = require('express');
const bodyParser = require('body-parser').urlencoded({
  extended: false,
});
const smsRouter = module.exports = express.Router();

const messaging = require('../lib/response');
const scripts = require('../lib/scripts');

const townHallHandler = require('../middleware/getDistricts');
const getEvents = require('../middleware/getEvents');
const checkSubscribe = require('../middleware/checkSubscribe');

const storage = {}

smsRouter.post('/sms',
  bodyParser,
  checkSubscribe,
  townHallHandler.checkZip,
  townHallHandler.getDistricts,
  getEvents,
  (req, res) => {
    if (req.session.townHalls.length > 0) {

      req.session.townHalls.forEach((townhall) => {
        req.twiml.message(townhall.print());
      });
      req.session.townHalls = [];
      req.twiml.message('That\'s all the events we have for your reps. Do you want sign up to get a text when your rep is holding a town hall?');
    } else {
      req.twiml.message(scripts.noEvents);
    }
    req.session.doyouwanttosignup = true;
    return messaging.end(res, req.twiml)

  });
