'use strict';
const firebasedb = require('../lib/firebaseinit');
const scripts = require('../lib/scripts');
const messaging = require('../lib/response');

const User = require('../models/user');

const zipcodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
const zipCleaner = /^\d{5}/g;

const townHallLookup = module.exports = {};

townHallLookup.checkZip = function(req, res, next) {
  let incoming = req.body.Body;

  if (incoming && incoming.match(zipcodeRegEx)) {
    req.zipcode = incoming.match(zipCleaner)[0];
    new User(req).updateCache(req);
    return next();
  }
  req.twiml.message(scripts.default);
  messaging.end(res, req.twiml);
};

townHallLookup.getDistricts = function(req, res, next) {
  //return state and a district as arrays;
  let districts = [];
  return firebasedb.ref(`zipToDistrict/${req.zipcode}`)
    .once('value')
    .then((districtsData) => {
      if (!districtsData.exists()) {
        return next(new Error(scripts.zipLookupFailed));
      }
      districtsData.forEach((district) => {
        let districtObj = {
          state: district.val().abr,
          district: district.val().dis,
        };
        districts.push(districtObj);
      });
      req.districts = districts;
      new User(req).updateCache(req);
      return next();
    }).catch(() => {
      next(scripts.zipLookupFailed);
    });
};
