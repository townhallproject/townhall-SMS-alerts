'use strict';

require('dotenv').load();
//jest.dontMock('firebase-admin');
const admin = require('firebase-admin');
const firebasekey = process.env.TESTING_PRIVATE_KEY.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.TESTING_PROJECT_ID,
    clientEmail: process.env.TESTING_CLIENT_ID,
    privateKey: firebasekey,
    databaseAuthVariableOverride: {
      uid: 'read-only',
    },
  }),
  databaseURL: `https://${process.env.TESTING_PROJECT_ID}.firebaseio.com`,
});

module.exports = admin.database();
