'use strict';

require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT || 3000;
const smsRouter = require('../routes/sms');
const app = express();
const messaging = require('./response');
let session = require('express-session');
let server = null;
const reqTwiml = require('../routes/sessionCounterMiddleware');

app.use(session({ secret: 'anything' }) );

app.use((req, res, next) => {
  let sessionData = req.session;
  sessionData.counter = sessionData.counter || 0;
  sessionData.counter++;
  next();
});

app.use(reqTwiml);

app.use(smsRouter);

app.use((err, req, res, next) => {
  console.log('err', err.message);
  messaging.sendAndWrite(res, err.message);
  next();
});

module.exports = {
  start: (port) => {
    let usePort = port || PORT;
    return new Promise( (resolve, reject) => {
      if (!server || !server.listening){

        server = app.listen(usePort , err => {

          if(err){

            reject(err);

          } else {


            resolve(`Server up on Port: ${usePort}`);
          }
        });

      } else {

        reject('Server is already running');

      }
    });
  },
  stop: () => {
    return new Promise( (resolve, reject) => {
      if(!server.listening){

        reject(console.log('Server is not running'));

      } else {

        server.close(err => {
          if(err){

            reject(err);

          } else {

            resolve('Server off');

          }
        });
      }
    });
  },
};
