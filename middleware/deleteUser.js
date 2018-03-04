'use strict';

const messaging = require('../lib/response');
const firebasedb = require('../lib/firebaseinit');

const deleteFromFirebase = function(req, disArray) {

  let firebaseref = firebasedb.ref();
  disArray.forEach(district => {
    let disPath = `sms-users/${district.state}/${district.district}/${req.body.From}`;
    firebaseref.child(disPath).remove();
  });

  return firebaseref.child(`sms-users/all-users/${req.body.From}`).remove();

};

module.exports = function(req, res){

  let districts = [];

  firebasedb.ref(`sms-users/all-users/${req.body.From}`).child('districts').once('value', function(snapshot){
    districts = snapshot.val();
    console.log('districts: ', districts);
  })
    .then( () => {
      deleteFromFirebase(req, districts);
    })
    .then( () => {
      req.twiml.message('You have been removed from receiving updates for all districts.  If you wish to receive updates again, simply text the area code where you would like to receive updates and resubscribe.');
      return messaging.end(res, req.twiml);
    });

};
