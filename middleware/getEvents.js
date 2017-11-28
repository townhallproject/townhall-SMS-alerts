'use strict';

const TownHall = require('../models/event.js');
const firebasedb = require('../lib/firebaseinit');

module.exports = function(req, res, next){
  if( req.subscribe === true){
    return next();
  }
  let townHalls = [];
  firebasedb.ref(`townHalls`).once('value')
    .then((snapshot) => {
      snapshot.forEach((fbtownhall) => {
        let townhall = new TownHall(fbtownhall.val());
        if (townhall.includeTownHall(req.session.districts)) {
          townHalls.push(townhall);
        }

      });
      req.townHalls = townHalls;
      return next();
    })
    .catch((e) => {
      console.log(e);
      next(new Error('Hey, sorry, but our database lookup failed'));
    });
};
