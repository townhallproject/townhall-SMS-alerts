'use strict';

require('dotenv').config();

const express = require('express');
const port = process.env.PORT || 3000;

const app = express();

let isRunning = false;

module.exports = {
  start: () => {
    console.log('reached');
    return new Promise( (resolve, reject) => {
      if(!isRunning){

        app.listen(port , err => {
          if(err){
            reject(err);
          } else {
            isRunning = true;
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
  },
};
