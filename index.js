'use strict';
const server = require('./lib/server.js');
const express = require('express');
const PORT = process.env.PORT || 3000;
const smsRouter = require('./routes/sms');
const voiceRouter = require('./routes/voice');
const app = express();
const messaging = require('./lib/response');
const reqTwiml = require('./middleware/session');
const database = require('./database/firebaseListener');
const checkQueue = require('./database/sendTextsInQueue');
app.use(reqTwiml, smsRouter);
app.use(voiceRouter);

/* eslint-disable */
app.use((err, req, res, next) => {
  console.log('err', err);
  return messaging.sendAndWrite(req, res, err.message);
});
/* eslint-enable */

server.start(app, PORT)
  .then(console.log)
  .then(database)
  .then(() => checkQueue.start())
  .catch(console.log);
