'use strict';
const server = require('./lib/server.js');
const express = require('express');
const PORT = process.env.PORT || 3000;
const smsRouter = require('./routes/sms');
const app = express();
const messaging = require('./lib/response');
const session = require('express-session');
const reqTwiml = require('./routes/sessionMiddleware');
const sessionSecret = process.env.SESSION_SECRET;

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));


app.use(reqTwiml, smsRouter);

app.use((err, req, res, next) => {
  console.log('err', err.message);
  messaging.sendAndWrite(req, res, err.message);
  next();
});

server.start(app, PORT)
  .then(console.log)
  .catch(console.log);
