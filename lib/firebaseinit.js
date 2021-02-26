'use strict';

require('dotenv').load();
//jest.dontMock('firebase-admin');
const admin = require('firebase-admin');
const testing = process.env.NODE_ENV !== 'production';
console.log('production?: ', !testing );

const privateKeyName = testing ? process.env.TESTING_PRIVATE_KEY : process.env.FIREBASE_PRIVATE_KEY;
const firebasekey = privateKeyName.replace(/\\n/g, '\n');
const projectID = testing ? process.env.TESTING_PROJECT_ID : process.env.FIREBASE_PROJECT_ID;
console.log(firebasekey.substr(0,10));
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: projectID,
    clientEmail: testing ? process.env.TESTING_CLIENT_ID :process.env.FIREBASE_CLIENT_ID,
    privateKey: firebasekey,
    databaseAuthVariableOverride: {
      uid: 'read-only',
    },
  }),
  databaseURL: `https://${projectID}.firebaseio.com`,
});

module.exports = admin.database();
