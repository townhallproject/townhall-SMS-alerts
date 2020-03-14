const firebasedb = require('./firebaseinit');
const fs = require('fs');

const writeStream = fs.createWriteStream('users-attending.txt');

// gets users 25 people at a time
const getUsers = function () {
  return firebasedb.ref('sms-users/all-users')
    .once('value')
    .then((snapshot) => {
      snapshot.forEach(person => {
        if (person.val().attending){
          writeStream.write([person.key, person.child('attending').numChildren()].join(',') +
                        '\n');
        }
      });
    });
};


getUsers();
module.exports = getUsers;
