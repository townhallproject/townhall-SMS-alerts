'use strict';
const express = require('express');
const bodyParser = require('body-parser').urlencoded({
  extended: false,
});
const smsRouter = module.exports = express.Router();

const messaging = require('../lib/response');

const townHallHandler = require('./townHallMiddleware');
const getEvents = require('./getEventsMiddleware');
const checkSubscribe = require('./checkSubscribeMiddleware');
const makeUser = require('./makeUserMiddleware');

smsRouter.post('/sms',
  bodyParser,
  checkSubscribe,
  townHallHandler.checkZip,
  townHallHandler.getDistricts,
  getEvents,
  (req, res) => {
    if(req.subscribe === true){
      return makeUser(req, res);
    }
    if (req.townHalls.length > 0) {
      req.townHalls.forEach((townhall) => {
        req.twiml.message(townhall.print());
      });
      req.twiml.message('That\'s all the events we have for your reps. Send subscribe <zip code> to get reoccuring updates.');
      return messaging.end(res, req.twiml);
    }
    messaging.sendAndWrite(req, res, 'There are not any upcoming town halls in your area. Send subscribe <zip code> to get reoccuring updates.');
  });
