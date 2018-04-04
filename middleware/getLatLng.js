'use strict';
const firebasedb = require('../lib/firebaseinit');
const scripts = require('../lib/scripts');

module.exports = function(req, res, next) {
  //return state and a district as arrays;
  return firebasedb.ref(`zips/${req.zipcode}`)
    .once('value')
    .then((latlngObj) => {
      if (!latlngObj.exists()) {
        return next();
      }
      const latlng = latlngObj.val();
      req.location = { lat:latlng.LAT, lng: latlng.LNG };
      return next();
    }).catch(() => {
      next(scripts.zipLookupFailed);
    });
};
