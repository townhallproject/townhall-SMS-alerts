'use strict';
const firebasedb = require('../lib/firebaseinit');
const bodyParser = require('body-parser').urlencoded({extended : false});
const express = require('express');
const smsRouter = module.exports = express.Router();
const townHallHandler = require('./townHall');
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
          console.log('got em');
          let message = '';
          townHalls.forEach((townhall) => {
            message = message + JSON.stringify(townhall);
          });
          console.log(message);
          return MessagingResponse(res, message);
        }
        return MessagingResponse(res, 'There are not any upcoming town halls in your area.');
      });
  });
