'use strict';
const firebasedb = require('../lib/firebaseinit');

module.exports = function (req, res, next) {
  if (!req.body.From || !req.body.Body){
    return next(new Error('No data'));
  }
  return firebasedb.ref(`sms-users/cached-users/`).child(`${req.body.From}`).once('value')
    .then(snapshot => {
      if (snapshot.exists()) {
        let user = snapshot.val();
        req.zipcode = user.zipcode;
        req.hasbeenasked = user.hasbeenasked || false;
        req.alertSent = user.alertSent || false;
        req.districts = user.districts || null;
        req.eventId = user.eventId || null;
        req.stateDistrict = user.stateDistrict || null;
      }
      return next();
    }).catch(err=>{
      console.log(err);
      return next();
    });
};