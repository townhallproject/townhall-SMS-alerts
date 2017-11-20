'use strict';
const firebasedb = require('../lib/firebaseinit');
const bodyParser = require('body-parser').urlencoded({
  extended: false,
});
const express = require('express');
const smsRouter = module.exports = express.Router();
const townHallHandler = require('./townHallMiddleware');
const TownHall = require('../models/event.js');
const messaging = require('../lib/response');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

smsRouter.post('/sms',
  bodyParser,
  townHallHandler.checkZip,
  townHallHandler.getDistricts,
  (req, res, next) => {
    let townHalls = [];
    firebasedb.ref(`townHalls`).once('value')
      .then((snapshot) => {
        snapshot.forEach((fbtownhall) => {
          let townhall = new TownHall(fbtownhall.val());
          if (townhall.includeTownHall(req.districtObj)) {
            townHalls.push(townhall);
          }
        });
        if (townHalls.length > 0) {
          let twiml = new MessagingResponse();
          townHalls.forEach((townhall) => {
            twiml.message(townhall.print());
          });
          twiml.message('That\'s all the events we have for your reps');
          return messaging.end(res, twiml);
        }
        messaging.sendAndWrite(res, 'There are not any upcoming town halls in your area.');
      }).catch((e) => {
        console.log(e);
        next(new Error('Hey, sorry, but our database lookup failed'));
      });
  });
