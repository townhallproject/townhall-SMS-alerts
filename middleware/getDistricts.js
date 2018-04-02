'use strict';
const firebasedb = require('../lib/firebaseinit');
const scripts = require('../lib/scripts');
const messaging = require('../lib/response');

const zipcodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
const zipCleaner = /^\d{5}/g;

const townHallLookup = module.exports = {};

townHallLookup.checkZip = function(req, res, next) {
  let incoming = req.body.Body;

  if (incoming && incoming.match(zipcodeRegEx)) {
    req.session.zipcode = incoming.match(zipCleaner)[0];
    console.log(`req zip: `, req.session.zipcode);
    return next();
  }
  req.twiml.message(scripts.default);
  messaging.end(res, req.twiml);
};

townHallLookup.getDistricts = function(req, res, next) {
  //return state and a district as arrays;
  let districts = [];
  console.log('getting districts', req.session.zipcode);
  return firebasedb.ref(`zipToDistrict/${req.session.zipcode}`)
    .once('value')
    .then((districtsData) => {
      if (!districtsData.exists()) {
        return next(new Error('We could not find that zip code.'));
      }
      districtsData.forEach((district) => {
        let districtObj = {
          state: district.val().abr,
          district: district.val().dis,
        };
        districts.push(districtObj);
      });
      req.session.districts = districts;
      return next();
    }).catch(() => {
      next('We couldnt find that zipcode.');
    });
};
