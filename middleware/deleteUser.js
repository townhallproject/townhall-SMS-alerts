'use strict';
const messaging = require('../lib/response');
const scripts = require('../lib/scripts');
const firebasedb = require('../lib/firebaseinit');

const deleteFromFirebase = function(req, disArray) {
  let firebaseref = firebasedb.ref();
  if(!disArray.length){
    return Promise.reject(scripts.alreadyUnsubscribed);
  }
  disArray.forEach(district => {
    let disPath = `sms-users/${district.state}/${district.district}/${req.body.From}`;
    firebaseref.child(disPath).remove();
  });

  return firebaseref.child(`sms-users/all-users/${req.body.From}`).remove();

};

module.exports = function(req, res){

  let districts = [];

  firebasedb.ref(`sms-users/all-users/${req.body.From}`).child('districts').once('value', function(snapshot){
    if (!snapshot.exists()){
      return Promise.reject(scripts.alreadyUnsubscribed);
    }
    districts = snapshot.val();
  })
    .then(() => {
      deleteFromFirebase(req, districts);
    })
    .then( () => {
      req.twiml.message(scripts.unSubscribe);
      return messaging.end(res, req.twiml);
    })
    .catch(err => {
      console.log(err);
      req.twiml.message('Sorry, unsubscribing you failed, please text PAUSE again.');
      return messaging.end(res, req.twiml);
    });

};
