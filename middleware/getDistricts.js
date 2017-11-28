'use strict';
const firebasedb = require('../lib/firebaseinit');
const zipcodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
const zipCleaner = /^\d{5}/g;

const townHallLookup = module.exports = {};

townHallLookup.checkZip = function(req, res, next) {
  let incoming = req.body.Body;
  if (req.subscribe === true){
    return next();
  }
  if (incoming && incoming.match(zipcodeRegEx)) {
    req.session.zipcode = incoming.match(zipCleaner)[0];
    console.log(`req zip: `, req.session.zipcode);
    return next();
  }
  console.log('err incoming : ', incoming);
  next(new Error('Hey, if you send us your zip code, we\'ll send you upcoming town halls for your reps.'));
};

townHallLookup.getDistricts = function(req, res, next) {
  //return state and a district as arrays;
  let districts = [];

  if (req.subscribe === true){
    return next();
  }

  return firebasedb.ref(`zipToDistrict/${req.session.zipcode}`).once('value').then((districtsData) => {
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
    req.districts = districts;
    console.log('district array', districts);
    return next();
  }).catch(() => {
    next('We couldnt find that zipcode.');
  });
};