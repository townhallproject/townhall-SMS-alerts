'use strict';

require('dotenv').load();
const admin = require('firebase-admin');
const firebasekey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_ID,
    privateKey: firebasekey,
    databaseAuthVariableOverride: {
      uid: 'read-only'
    },
  }),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

module.exports = admin.database();
