'use strict';
const makeUser = require('../middleware/makeUser');
const firebasedb = require('../lib/firebaseinit');


module.exports = function(req, res){

  firebasedb.ref(`sms-users/all-users/`).child(`${req.body.From}`).once('value', function(snapshot){
    if(snapshot.exists()){
      req.userDistricts = snapshot.val();
    } 
    return makeUser(req, res);

  });

};
