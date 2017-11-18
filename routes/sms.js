'use strict';

const bodyParser = require('body-parser').urlencoded({extended : false});
const express = require('express');
const MessagingResponse = require('../lib/response');
const zipcodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
const smsRouter = module.exports = express.Router();
const townHallHandler = require('./townHall');
const zipCleaner = /^\d{5}/g;
smsRouter.post('/sms', bodyParser, (req, res) => {
  let incoming = req.body.Body;
  if (incoming.match(zipcodeRegEx)){

    let zip = incoming.match(zipCleaner)[0];
    townHallHandler.getDistricts(zip)
      .then(townHallHandler.getEvents)
      .then((events)=>{
        MessagingResponse(res, 'Hi 2');
        // MessagingResponse(events);
      })

      .catch((err)=>{
        MessagingResponse(res, err);
      })
    ;

  }
});
