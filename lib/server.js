'use strict';

const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const request = require('request');
require('dotenv').config();

const app = express();

let isRunning = false;

module.exports = {
  start: () => {
    console.log('reached');
    return new Promise( (resolve, reject) => {
      if(!isRunning){

        app.listen(process.env.PORT || 3000 , err => {
          if(err){
            reject(err);
          } else {
            isRunning = true;
            console.log(`Server up on Port:${process.env.PORT}`);
          }
        });

      } else {

        reject(console.log('Server is already running'));

      }
    });
  },
  stop: () => {
    return new Promise( (resolve, reject) => {
      if(!isRunning){

        reject(console.log('Server is not running'));

      } else {

        app.close(err => {
          if(err){
            reject(err);
          } else {
            isRunning = false;
            console.log('Server off');
          }
        });

      }
    });
  }
};
