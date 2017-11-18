'use strict';

const bodyParser = require('body-parser').urlencoded({extended : false});
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const zipcodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
const smsRouter = module.exports = express.Router();
const townHallHandler = require('./townHall');
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

  }
});
