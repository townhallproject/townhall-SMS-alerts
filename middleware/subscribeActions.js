'use strict';

const makeUser = require('../middleware/makeUser');
const firebasedb = require('../lib/firebaseinit');


module.exports = function(req, res){

  firebasedb.ref(`sms-users/all-users/`).child(`${req.body.From}`).once('value', function(snapshot){
    if(snapshot.exists()){
      console.log('snap: ', snapshot.val());
      req.userDistricts = snapshot.val();
    } else {
      console.log('user does not exist');
    }

    return makeUser(req, res);

  });

};
