'use strict';
const firebasedb = require('../lib/firebaseinit');
const bodyParser = require('body-parser').urlencoded({
  extended: false,
});
const express = require('express');
const smsRouter = module.exports = express.Router();
const townHallHandler = require('./townHallMiddleware');
const TownHall = require('../models/event.js');
const MessagingResponse = require('../lib/response');

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
          let message = '';
          townHalls.forEach((townhall) => {
            message = message + townhall.print();
          });
          return MessagingResponse(res, message);
        }
        console.log('no messages');
        MessagingResponse(res, 'There are not any upcoming town halls in your area.');
      }).catch(() => {
        next(new Error('Hey, sorry, but our database lookup failed'));
      });
  });
