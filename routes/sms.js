'use strict';
const express = require('express');
const bodyParser = require('body-parser').urlencoded({
  extended: false,
});

const smsRouter = module.exports = express.Router();
const messaging = require('../lib/response');
const scripts = require('../lib/scripts');

const User = require('../models/user');

const townHallHandler = require('../middleware/townHallLookup');
const getLatLng = require('../middleware/getLatLng');
const getEvents = require('../middleware/getEvents');
const checkSubscribe = require('../middleware/checkSubscribe');
const getUserFromCache = require('../middleware/getUserFromCache');

smsRouter.post('/sms',
  bodyParser,
  getUserFromCache,
  checkSubscribe,
  townHallHandler.checkZip,
  townHallHandler.getDistricts,
  getLatLng,
  getEvents,
  (req, res) => {
    if (req.townHalls.length > 0) {
      req.townHalls.forEach((townhall) => {
        req.twiml.message(townhall.print());
      });
      req.twiml.message('That\'s all the events we have for your reps. Do you want to sign up to get a text when your rep is holding a town hall? (Y/N)');
    } else {
      req.twiml.message(scripts.noEvents);
    }
    req.hasbeenasked = true;
    new User(req).updateCache(req);
    messaging.end(res, req.twiml);
  });
