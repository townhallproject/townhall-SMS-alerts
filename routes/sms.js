'use strict';
const firebasedb = require('../lib/firebaseinit');
const bodyParser = require('body-parser').urlencoded({extended : false});
const express = require('express');
const smsRouter = module.exports = express.Router();
const townHallHandler = require('./townHall');
<<<<<<< HEAD
const zipCleaner = /^\d{5}/g;
smsRouter.post('/sms', bodyParser, (req, res) => {
  console.log(`req.body: `, req.body.Body);
  let incoming = req.body.Body;
  if (incoming.match(zipcodeRegEx)){

    let zip = incoming.match(zipCleaner)[0];
    townHallHandler.getDistricts(zip)
      .then(townHallHandler.getEvents)
      .then((events)=>{
        const twiml = new MessagingResponse();
        twiml.message(events);
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
      })

      .catch((err)=>{
        const twiml = new MessagingResponse();
        twiml.message(err);

        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
      })
    ;
=======
const TownHall = require('../models/event.js');
const MessagingResponse = require('../lib/response');
>>>>>>> ac94d67aa75bdce8ea3f27f74116a447b6aa55f8

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
        MessagingResponse(res, 'There are not any upcoming town halls in your area.');
      }).catch(() => {
        next(new Error('Hey, sorry, but our database lookup failed'));
      });
  });
