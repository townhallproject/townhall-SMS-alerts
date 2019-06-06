'use strict';
const express = require('express');

const VoiceResponse = require('twilio').twiml.VoiceResponse;
const scripts = require('../lib/scripts');
const voiceRouter = module.exports = express.Router();

voiceRouter.post('/voice',
  (req, res) => {
    const twiml = new VoiceResponse();
    twiml.say({ voice: 'alice' }, scripts.voiceMessage);
    // Render the response as XML in reply to the webhook request
    res.type('text/xml');
    res.send(twiml.toString());
  });
