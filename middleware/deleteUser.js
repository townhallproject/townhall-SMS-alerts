'use strict';

const messaging = require('../lib/response');
const firebasedb = require('../lib/firebaseinit');

const deleteFromFirebase = function(req, disArray) {

  console.log('reached 1');

  let firebaseref = firebasedb.ref();
  disArray.forEach(district => {
    console.log('reached');
    let disPath = `sms-users/${district.state}/${district.district}/${req.body.From}`;
    firebaseref.child(disPath).remove();
  });

  return firebaseref.child(`sms-users/all-users/${req.body.From}`).remove();
  
};

module.exports = function(req, res){

  let zipcodes;
  let districts = [];

  firebasedb.ref(`sms-users/all-users/${req.body.From}`).child('zipcodes').once('value', function(snapshot){
    zipcodes = snapshot.val();
    console.log('zipcodes: ', zipcodes);
  })
    .then( () => {
      zipcodes.forEach(zip => {
        firebasedb.ref(`zipToDistrict/${zip}`).once('value').then(districtData => {
          districtData.forEach(district => {
            let districtObj = {
              state: district.val().abr,
              district: district.val().dis,
            };
            districts.push(districtObj);
          });
          console.log('districts: ', districts);
        })
          .then( () => {
            deleteFromFirebase(req, districts);
          });
      });
    });

};
