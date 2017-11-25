'use strict';
const firebasedb = require('../lib/firebaseinit');
const zipcodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
const zipCleaner = /^\d{5}/g;

const townHallLookup = module.exports = {};

townHallLookup.checkZip = function(req, res, next) {
  let incoming = req.body.Body;
  if(req.subscribe === true){
    let response = req.body.Body.split(' ');
    incoming = response[1];
  }
  if (incoming && incoming.match(zipcodeRegEx)) {
    req.zipcode = incoming.match(zipCleaner)[0];
    console.log(`req zip: `, req.zipcode);
    return next();
  }
  console.log('err incoming : ', incoming);
  next(new Error('Please send us a zipcode to get upcoming events for your reps.'));
};

townHallLookup.getDistricts = function(req, res, next) {
  //return state and a district as arrays;
  let districtObj = {
    states: [],
    districts: [],
  };
  return firebasedb.ref(`zipToDistrict/${req.zipcode}`).once('value').then((districtsData) => {
    if (!districtsData.exists()) {
      return next(new Error('We could not find that zip code.'));
    }
    districtsData.forEach((district) => {
      districtObj.states.push(district.val().abr);
      districtObj.districts.push(`${district.val().abr}-${Number(district.val().dis)}`);
    });
    req.districtObj = districtObj;
    console.log('district object', districtObj);
    return next();
  }).catch(() => {
    next('We couldnt find that zipcode.');
  });
};
