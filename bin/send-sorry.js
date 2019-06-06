#!/usr/bin/env node

const server = require('../lib/server.js');
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();

const messaging = require('../lib/response');
const body = 'Sorry! We erroneously sent out info about a Martha Roby town hall. This event is NOT happening. Please accept our apologies. We do our best to verify every event before sending but made a mistake here. Thank you for your understanding and support. -Town Hall Project';

/* eslint-enable */

server.start(app, PORT)
  .then(console.log)
  .then(() => {
    return messaging.newMessage(body, '+12196169081')
  })
  .then(()=> {
    console.log('sent')
  })
  .catch((e) => {
      console.log(e)
  })
