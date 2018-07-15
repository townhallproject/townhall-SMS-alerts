'use strict';
const firebasedb = require('../lib/firebaseinit');

module.exports = function (req) {
  let state = req.stateDistrict.split('-')[0];
  let districtNumber = req.stateDistrict.split('-')[1];
  let path;
  if (districtNumber === 'Senate') {
    path = `sms-users/${state}`;
  } else {
    path = `sms-users/${state}/${districtNumber}`;
  }
  const userRef = firebasedb.ref(path).child(req.body.From);
  return userRef.once('value')
    .then((snapshot) => {
      if(snapshot.exists()) {
        userRef.remove();
      }
    });
};
