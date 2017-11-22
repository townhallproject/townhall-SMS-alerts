'use strict';
const server = require('./lib/server.js');
const express = require('express');
const PORT = process.env.PORT || 3000;
const smsRouter = require('./routes/sms');
const app = express();
const messaging = require('./lib/response');
const session = require('express-session');

app.use(session({ secret: process.env.SESSION_SECRET }) );

app.use((req, res, next) => {
  let sessionData = req.session;
  sessionData.counter = sessionData.counter || 0;
  sessionData.counter++;
  next();
});

app.use(smsRouter);

app.use((err, req, res, next) => {
  console.log('err', err.message);
  messaging.sendAndWrite(res, err.message);
  next();
});

server.start(app, PORT)
  .then(console.log)
  .catch(console.log);
