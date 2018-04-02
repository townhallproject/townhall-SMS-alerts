'use strict';
const express = require('express');
const bodyParser = require('body-parser').urlencoded({
  extended: false,
});
const smsRouter = module.exports = express.Router();

const messaging = require('../lib/response');

const townHallHandler = require('../middleware/getDistricts');
const getEvents = require('../middleware/getEvents');
const checkSubscribe = require('../middleware/checkSubscribe');
const deleteUser = require('../middleware/deleteUser');
const subscribeActions = require('../middleware/subscribeActions');

smsRouter.post('/sms',
  bodyParser,
  checkSubscribe,
  townHallHandler.checkZip,
  townHallHandler.getDistricts,
  getEvents,
  (req, res) => {
    if(req.subscribe){
      return subscribeActions(req, res);
    }
    if(req.unsubscribe){
      return deleteUser(req, res);
    }
    if (req.townHalls.length > 0) {
      req.townHalls.forEach((townhall) => {
        req.twiml.message(townhall.print());
      });
      req.twiml.message('That\'s all the events we have for your reps. Do you want to be notified when there are new events posted?');
      return messaging.end(res, req.twiml);
    }
    messaging.sendAndWrite(req, res, 'There are not any upcoming town halls in your area. Do you want to be notified when there are new events posted?');

  });
