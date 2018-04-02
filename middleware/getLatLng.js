'use strict';
const firebasedb = require('../lib/firebaseinit');

module.exports = function(req, res, next) {
  //return state and a district as arrays;
  console.log('getting latlng', req.session.zipcode);
  return firebasedb.ref(`zips/${req.session.zipcode}`)
    .once('value')
    .then((latlngObj) => {
      if (!latlngObj.exists()) {
        return next();
      }
      const latlng = latlngObj.val();
      req.session.location = { lat:latlng.LAT, lng: latlng.LNG };
      return next();
    }).catch(() => {
      next('We couldnt locate that zipcode.');
    });
};
