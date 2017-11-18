'use strict';

require('dotenv').config();

const express = require('express');
const port = process.env.PORT || 3000;
const smsRouter = require('../routes/sms');
const app = express();
const messageResponse = require('./response');
let server = null;

app.use(smsRouter);

app.use((err, req, res, next) => {
  console.log(err);
  messageResponse(res, err.message);
  next();
});

module.exports = {
  start: () => {
    return new Promise( (resolve, reject) => {
      if (!server || !server.listening){

        server = app.listen(port , err => {

          if(err){

            reject(err);

          } else {

            console.log(`Server up on Port: ${port}`);

          }
        });

      } else {

        reject(console.log('Server is already running'));

      }
    });
  },
  stop: () => {
    return new Promise( (resolve, reject) => {
      if(!server.listening){

        reject(console.log('Server is not running'));

      } else {

        app.close(err => {
          if(err){

            reject(err);

          } else {

            console.log('Server off');

          }
        });
      }
    });
  },
};
